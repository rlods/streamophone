
const AUDIO_CONTEXT = new (window.AudioContext || window.webkitAudioContext)()
const WAVE_WIDTH = 2
const WAVE_COLOR = 'rgb(0, 0, 0)'
const WAVE_FFT_SIZE = 512 // 2048
const CURRENT_TIME_COLOR = 'rgba(0, 0, 0, 0.5)'

// ------------------------------------------------------------------

export default class CustomAudio
{
	constructor(url, startCB, stopCB) {
		this._animationFrameRequest = null
		this._audioBuffer = null
		this._canvas = null
		this._duration = 0
		this._loop = true
		this._loopStart = 0
		this._playing = false
		this._ready = false
		this._sourceNode = null
		this._speed = 1.0
		this._startCB = startCB
		this._stopCB = stopCB
		this._url = url

		this._gainNode = AUDIO_CONTEXT.createGain()
		this._gainNode.gain.value = 1.0
		this._gainNode.connect(AUDIO_CONTEXT.destination)
		this._analyserNode = AUDIO_CONTEXT.createAnalyser()
		this._analyserNode.fftSize = WAVE_FFT_SIZE
		// this._analyserNode.minDecibels = -90
		// this._analyserNode.maxDecibels = -10
		this._analyserNode.connect(this._gainNode)

		this._startedAt = 0
	}

	getSpeed() {
		return this._speed
	}
	
	setCanvas(canvas) {
		this._canvas = canvas
		if (canvas && this._playing) {
			this._startVisualization()
		}
	}
	
	setLoop(duration) {
		this._duration = duration / 1000.0
	}
	
	setSpeed(speed) {
		this._speed = speed
		if (null !== this._sourceNode)
			this._sourceNode.playbackRate.value = speed
	}
	
	setVolume(volume) {
		this._gainNode.gain.value = volume
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

	start() {
		if (this._ready && !this._playing) {
			this._sourceNode = AUDIO_CONTEXT.createBufferSource()
			this._sourceNode.buffer = this._audioBuffer
			this._sourceNode.loop = this._loop
			this._sourceNode.loopStart = this._loopStart
			this._sourceNode.loopEnd = this._duration > 0 ? this._loopStart + this._duration : this._audioBuffer.duration
			this._sourceNode.onended = this._onStop.bind(this)
			this._sourceNode.playbackRate.value = this._speed
			this._sourceNode.connect(this._analyserNode)
			this._sourceNode.start() // A new BufferSource must be created for each start
			this._playing = true
			this._startedAt = AUDIO_CONTEXT.currentTime
			this._startCB()
			if (this._canvas) {
				this._startVisualization()
			}
		}
	}

	stop() {
		if (null !== this._sourceNode)
			this._sourceNode.stop()
	}

	_onStop() {
		this._stopVisualization()
		this._stopCB()
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

	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#Audio_Workers
	_startVisualization() { // TODO: move outside of CustomAudio class
		const width = this._canvas.width
		const height = this._canvas.width
		const canvasCtx = this._canvas.getContext('2d')
		const bufferLength = this._analyserNode.frequencyBinCount // half the FFT value
		const dataArray = new Uint8Array(bufferLength)
		const sliceWidth = width * 1.0 / bufferLength

		canvasCtx.lineWidth = WAVE_WIDTH
		canvasCtx.strokeStyle = WAVE_COLOR

		const draw = () => {
			if (this._playing) {
				this._animationFrameRequest = requestAnimationFrame(draw)

				canvasCtx.clearRect(0, 0, width, height)

				const duration = this._sourceNode.loopEnd - this._sourceNode.loopStart
				const elapsed = ((AUDIO_CONTEXT.currentTime - this._startedAt) % duration) * width / duration
				canvasCtx.fillStyle = CURRENT_TIME_COLOR
				canvasCtx.fillRect(0, 0, elapsed, height)

				if (true) {
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
					// OSCI // TODO
					// https://developer.mozilla.org/fr/docs/Web/API/AnalyserNode/minDecibels

					this._analyserNode.getByteFrequencyData(dataArray)
					const wbar = (width / bufferLength) * 2.5
					for (let i = 0, x = 0, hbar; i < bufferLength; ++i, x += wbar + 1) {
						hbar = dataArray[i]
						canvasCtx.fillStyle = 'rgb(255, 255, 255)'
						//canvasCtx.fillStyle = 'rgb(' + (hbar + 100) + ', 50, 50)'
						canvasCtx.fillRect(x, height - hbar / 2, wbar, hbar / 2)
					}
				}
			}
		}
		this._animationFrameRequest = requestAnimationFrame(draw)
	}

	_stopVisualization() {
		if (null !== this._animationFrameRequest) {
			window.cancelAnimationFrame(this._animationFrameRequest)
			this._animationFrameRequest = null
		}
	}
}

// ------------------------------------------------------------------

/*
async function test() {
	const audio = new CustomAudio('https://e-cdns-preview-2.dzcdn.net/stream/2ccd5277fa71187105b2450abf020d79-3.mp3')

	await audio.init()
	audio.start()

	setTimeout(() => {
		audio.setSpeed(1.5)

		setTimeout(() => {
			audio.setVolume(0.2)
		}, 2000)

	}, 2000)
}

test()
*/
