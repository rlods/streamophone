import { AUDIO_CONTEXT } from './'

// ------------------------------------------------------------------

const CURRENT_TIME_COLOR = 'rgba(0, 0, 0, 0.5)'

const VISU_STYLE = 1 // 0=wave, 1=bar

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

export default class CustomAudio
{
	constructor(url, eventCB) {
		this._audioBuffer = null
		this._canvas = null
		this._drawingFrameRequest = null
		this._eventCB = eventCB
		this._loop = true
		this._loopEnd = 0
		this._loopStart = 0
		this._playing = false
		this._ready = false
		this._sourceNode = null
		this._speed = 1.0
		this._startedAt = 0
		this._url = url

		this._gainNode = AUDIO_CONTEXT.createGain()
		this._gainNode.gain.value = 1.0
		this._gainNode.connect(AUDIO_CONTEXT.destination)

		this._analyserNode = AUDIO_CONTEXT.createAnalyser()
		this._analyserNode.fftSize = VISU_STYLE === 0 ? WAVE_FFT_SIZE : BAR_FFT_SIZE
		this._analyserNode.minDecibels = -90
		this._analyserNode.maxDecibels = -10
		this._analyserNode.connect(this._gainNode)
	}

	async init() {
		if (!this._ready) {
			try {
				this._audioBuffer = await this._loadAudioBuffer()
				this._ready = true
			}
			catch (error) {
				console.log('Audio buffer creation failed', error)
			}
		}
	}

	setLoop(loopStart, loopEnd) {
		if (this._eventCB)
			this._eventCB([AUDIO_EVENT_LOOP, loopStart, loopEnd])
		this._loopEnd = loopEnd
		this._loopStart = loopStart
		if (null !== this._sourceNode) {
			this._sourceNode.loopEnd = this._loopEnd
			this._sourceNode.loopStart = this._loopStart
		}
	}
	
	setSpeed(speed) {
		if (this._eventCB)
			this._eventCB([AUDIO_EVENT_SPEED, speed])
		this._speed = speed
		if (null !== this._sourceNode)
			this._sourceNode.playbackRate.value = speed
	}
	
	setVolume(volume) {
		if (this._eventCB)
			this._eventCB([AUDIO_EVENT_VOLUME, volume])
		this._gainNode.gain.value = volume
	}

	start() {
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

	stop() {
		if (null !== this._sourceNode)
			this._sourceNode.stop()
	}

	_onStop() {
		this._stopVisualization()
		if (this._eventCB)
			this._eventCB([AUDIO_EVENT_PAUSE])
		this._playing = false
		this._sourceNode = null
	}

	_loadAudioBuffer() {
		return new Promise((resolve, reject) => {
			const req = new XMLHttpRequest()
			req.open('GET', this._url, true)
			req.responseType = 'arraybuffer'
			req.onload = () => AUDIO_CONTEXT.decodeAudioData(req.response, buffer => resolve(buffer), error => reject(error))
			req.send()
		})
	}

	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------
	
	attachCanvas(canvas) { // must be reattached each time a track is played
		this._canvas = canvas
		if (this._playing)
			this._startVisualization()
	}
	
	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#Audio_Workers
	_startVisualization() { // TODO: move outside of CustomAudio class
		if (this._canvas) {
			const width = this._canvas.width
			const height = this._canvas.width
			const canvasCtx = this._canvas.getContext('2d')
			const bufferLength = this._analyserNode.frequencyBinCount // half the FFT value
			const dataArray = new Uint8Array(bufferLength)
			const sliceWidth = width * 1.0 / bufferLength
			canvasCtx.lineWidth = WAVE_WIDTH
			canvasCtx.strokeStyle = WAVE_COLOR

			const draw = () => {
				canvasCtx.clearRect(0, 0, width, height)
				if (this._drawingFrameRequest) { // if previous _drawingFrameRequest has been set to null we don't request a new one
					this._drawingFrameRequest = requestAnimationFrame(draw)

					const duration = (this._sourceNode.loopEnd || this._audioBuffer.duration) - this._sourceNode.loopStart
					const elapsed = ((AUDIO_CONTEXT.currentTime - this._startedAt) % duration) * width / duration
					canvasCtx.fillStyle = CURRENT_TIME_COLOR
					canvasCtx.fillRect(0, 0, elapsed, height)

					if (VISU_STYLE === 0) {
						// WAVE
						this._analyserNode.getByteTimeDomainData(dataArray)
						canvasCtx.beginPath()
						for (let i = 0, x = 0, v, y; i < bufferLength; ++i, x += sliceWidth) {
							v = dataArray[i] / 128.0
							y = v * height / 2

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
						for (let i = 0, x = 0, hbar; i < bufferLength; ++i, x += wbar + BAR_MARGIN) {
							hbar = dataArray[i]
							canvasCtx.fillStyle = 'rgba(' + (hbar + 100) + ', 0, 0, 0.5)'
							canvasCtx.fillRect(x, height - hbar / 2, wbar, hbar / 2)
						}
					}
				}
			}
			this._drawingFrameRequest = requestAnimationFrame(draw)
		}
	}

	_stopVisualization() {
		this._drawingFrameRequest = null
	}
}
