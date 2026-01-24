import { AUDIO_CONTEXT } from './'

// ------------------------------------------------------------------

const CURRENT_TIME_COLOR = 'rgba(0, 0, 0, 0.5)'

const VISU_STYLE: number = 1 // 0=wave, 1=bar

const WAVE_COLOR = 'rgb(255, 0, 0)'
const WAVE_FFT_SIZE = 256
const WAVE_WIDTH = 2

const BAR_FFT_SIZE = 128
const BAR_MARGIN = 0

// ------------------------------------------------------------------

export const AUDIO_EVENT_PLAY   = 1
export const AUDIO_EVENT_PAUSE  = 2
export const AUDIO_EVENT_SPEED  = 3
export const AUDIO_EVENT_VOLUME = 4
export const AUDIO_EVENT_LOOP   = 5

// ------------------------------------------------------------------

export type AudioEvent =
	| [typeof AUDIO_EVENT_PLAY]
	| [typeof AUDIO_EVENT_PAUSE]
	| [typeof AUDIO_EVENT_SPEED, number]
	| [typeof AUDIO_EVENT_VOLUME, number]
	| [typeof AUDIO_EVENT_LOOP, number, number]

export type AudioEventCallback = (event: AudioEvent) => void

// ------------------------------------------------------------------

export default class CustomAudio {
	private _audioBuffer: AudioBuffer | null = null
	private _canvas: HTMLCanvasElement | null = null
	private _drawingFrameRequest: number | null = null
	private _eventCB: AudioEventCallback | null
	private _loop: boolean = true
	private _loopEnd: number = 0
	private _loopStart: number = 0
	private _playing: boolean = false
	private _ready: boolean = false
	private _sourceNode: AudioBufferSourceNode | null = null
	private _speed: number = 1.0
	private _startedAt: number = 0
	private _url: string

	private _gainNode: GainNode
	private _analyserNode: AnalyserNode

	constructor(url: string, eventCB?: AudioEventCallback) {
		this._url = url
		this._eventCB = eventCB || null

		this._gainNode = AUDIO_CONTEXT.createGain()
		this._gainNode.gain.value = 1.0
		this._gainNode.connect(AUDIO_CONTEXT.destination)

		this._analyserNode = AUDIO_CONTEXT.createAnalyser()
		this._analyserNode.fftSize = VISU_STYLE === 0 ? WAVE_FFT_SIZE : BAR_FFT_SIZE
		this._analyserNode.minDecibels = -90
		this._analyserNode.maxDecibels = -10
		this._analyserNode.connect(this._gainNode)
	}

	async init(): Promise<void> {
		if (!this._ready) {
			this._audioBuffer = await this._loadAudioBuffer()
			this._ready = true
		}
	}

	setLoop(loopStart: number, loopEnd: number): void {
		if (this._eventCB)
			this._eventCB([AUDIO_EVENT_LOOP, loopStart, loopEnd])
		this._loopEnd = loopEnd
		this._loopStart = loopStart
		if (null !== this._sourceNode) {
			this._sourceNode.loopEnd = this._loopEnd
			this._sourceNode.loopStart = this._loopStart
		}
	}

	setSpeed(speed: number): void {
		if (this._eventCB)
			this._eventCB([AUDIO_EVENT_SPEED, speed])
		this._speed = speed
		if (null !== this._sourceNode)
			this._sourceNode.playbackRate.value = speed
	}

	setVolume(volume: number): void {
		if (this._eventCB)
			this._eventCB([AUDIO_EVENT_VOLUME, volume])
		this._gainNode.gain.value = volume
	}

	play(): void {
		if (this._ready && !this._playing) {
			this._playing = true
			this._sourceNode = AUDIO_CONTEXT.createBufferSource()
			this._sourceNode.buffer = this._audioBuffer
			this._sourceNode.loop = this._loop
			this._sourceNode.loopStart = this._loopStart
			this._sourceNode.loopEnd = this._loopEnd
			this._sourceNode.onended = this._onStop.bind(this)
			this._sourceNode.playbackRate.value = this._speed
			this._sourceNode.connect(this._analyserNode)
			this._sourceNode.start() // A new BufferSource must be created for each start
			this._startedAt = AUDIO_CONTEXT.currentTime
			if (this._eventCB)
				this._eventCB([AUDIO_EVENT_PLAY])
			this._startVisualization()
		}
	}

	pause(): void {
		if (null !== this._sourceNode)
			this._sourceNode.stop()
	}

	private _onStop(): void {
		this._stopVisualization()
		if (this._eventCB)
			this._eventCB([AUDIO_EVENT_PAUSE])
		this._playing = false
		this._sourceNode = null
	}

	private _loadAudioBuffer(): Promise<AudioBuffer> {
		return new Promise((resolve, reject) => {
			const req = new XMLHttpRequest()
			req.open('GET', this._url, true)
			req.responseType = 'arraybuffer'
			req.addEventListener('error', () => reject(new Error('Audio buffer loading failed')), false)
			req.addEventListener('load', async () => {
				try {
					// https://github.com/WebAudio/web-audio-api/issues/1305
					resolve(await AUDIO_CONTEXT.decodeAudioData(req.response))
				}
				catch (error) {
					// INA sometimes returns raw text 'Fichier non trouve' without any error code
					reject(error)
				}
			}, false)
			req.send()
		})
	}

	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------

	attachCanvas(canvas: HTMLCanvasElement | null): void { // must be reattached each time a track is played
		this._canvas = canvas
		if (this._playing)
			this._startVisualization()
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#Audio_Workers
	private _startVisualization(): void { // TODO: move outside of CustomAudio class
		if (this._canvas) {
			const width = this._canvas.width
			const height = this._canvas.width
			const canvasCtx = this._canvas.getContext('2d')
			if (!canvasCtx) return

			const bufferLength = this._analyserNode.frequencyBinCount // half the FFT value
			const dataArray = new Uint8Array(bufferLength)
			const sliceWidth = width * 1.0 / bufferLength
			canvasCtx.lineWidth = WAVE_WIDTH
			canvasCtx.strokeStyle = WAVE_COLOR

			const draw = (): void => {
				canvasCtx.clearRect(0, 0, width, height)
				if (this._drawingFrameRequest) { // if previous _drawingFrameRequest has been set to null we don't request a new one
					this._drawingFrameRequest = requestAnimationFrame(draw)

					const duration = (this._sourceNode!.loopEnd || this._audioBuffer!.duration) - this._sourceNode!.loopStart
					const elapsed = ((AUDIO_CONTEXT.currentTime - this._startedAt) % duration) * width / duration
					canvasCtx.fillStyle = CURRENT_TIME_COLOR
					canvasCtx.fillRect(0, 0, elapsed, height)

					if (VISU_STYLE === 0) {
						// WAVE
						this._analyserNode.getByteTimeDomainData(dataArray)
						canvasCtx.beginPath()
						let x = 0
						for (let i = 0; i < bufferLength; ++i, x += sliceWidth) {
							const v = dataArray[i] / 128.0
							const y = v * height / 2

							if (i === 0)
								canvasCtx.moveTo(x, y)
							else
								canvasCtx.lineTo(x, y)
						}
						canvasCtx.lineTo(width, height / 2)
						canvasCtx.stroke()
					}
					else {
						// OSCI https://developer.mozilla.org/fr/docs/Web/API/AnalyserNode/minDecibels
						this._analyserNode.getByteFrequencyData(dataArray)
						const wbar = (width / bufferLength) * 2.5
						let x = 0
						for (let i = 0; i < bufferLength; ++i, x += wbar + BAR_MARGIN) {
							const hbar = dataArray[i]
							canvasCtx.fillStyle = 'rgba(' + (hbar + 100) + ', 0, 0, 0.5)'
							canvasCtx.fillRect(x, height - hbar / 2, wbar, hbar / 2)
						}
					}
				}
			}
			this._drawingFrameRequest = requestAnimationFrame(draw)
		}
	}

	private _stopVisualization(): void {
		this._drawingFrameRequest = null
	}
}
