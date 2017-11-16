import config from '../config'

// --------------------------------------------------------------

const AUDIO_CONTEXT = new (window.AudioContext || window.webkitAudioContext)()

// ------------------------------------------------------------------

export default class CustomAudio
{
	constructor(url) {
		this.playing = false
		this.ready = false
		this.onStop = null
		this._animationFrameRequest = null
		this._audioBuffer = null
		this._canvas = null
		this._loop = false
		this._loopStart = 0
		this._loopEnd = 0
		this._sourceNode = null
		this._speed = 1.0
		this._url = url

		this._gainNode = AUDIO_CONTEXT.createGain()
		this._gainNode.gain.value = 1.0
		this._gainNode.connect(AUDIO_CONTEXT.destination)
		this._analyserNode = AUDIO_CONTEXT.createAnalyser()
		this._analyserNode.fftSize = 2048
		this._analyserNode.connect(this._gainNode)
	}

	getSpeed() {
		return this._speed
	}
	
	setCanvas(canvas) {
		this._canvas = canvas
	}
	
	setLoop(duration) {
		this._loop = true // duration < 0 // loop if duration < 0
		this._loopEnd = duration > 0 && duration <= config.SAMPLE_MAX_DURATION ? duration / 1000.0 : 0
		if (null !== this._sourceNode) {
			this._sourceNode.loop = this._loop
		}
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
		if (!this.ready) {
			try {
				this._audioBuffer = await this._loadAudioBuffer()
				this.ready = true
			}
			catch (error) {
				console.log('Audio buffer creation failed', error)
			}
		}
	}

	start() {
		if (this.ready) {
			this._sourceNode = AUDIO_CONTEXT.createBufferSource()
			this._sourceNode.buffer = this._audioBuffer
			this._sourceNode.playbackRate.value = this._speed
			this._sourceNode.loop = this._loop
			this._sourceNode.loopStart = this._loopStart
			this._sourceNode.loopEnd = this._loopEnd
			this._sourceNode.onended = this._onStop.bind(this)
			this._sourceNode.connect(this._analyserNode)
			this._sourceNode.start() // NOTE that a new BufferSource must be created for each start
			this.playing = true
			this._startVisualization()
		}
	}

	stop() {
		if (null !== this._sourceNode) {
			this._sourceNode.stop() // NOTE that a new BufferSource must be created for each start
			this._onStop()
		}
	}

	_onStop() {
		this._stopVisualization()
		if (null !== this.onStop)
			this.onStop()
		this.playing = false
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
	_startVisualization() {
		const width = this._canvas.width
		const height = this._canvas.width
		const canvasCtx = this._canvas.getContext('2d')
		const bufferLength = this._analyserNode.frequencyBinCount // half the FFT value
		const dataArray = new Uint8Array(bufferLength)

		canvasCtx.lineWidth = 1
		canvasCtx.strokeStyle = 'rgb(255, 0, 0)'

		const draw = () => {
			if (this.playing) {
				this._animationFrameRequest = requestAnimationFrame(draw)
				this._analyserNode.getByteTimeDomainData(dataArray)

				canvasCtx.clearRect(0, 0, width, height)
				canvasCtx.beginPath()

				let sliceWidth = width * 1.0 / bufferLength
				let x = 0, v, y
				for (let i = 0; i < bufferLength; ++i, x += sliceWidth) {
					v = dataArray[i] / 128.0
					y = v * height/2

					if (i === 0)
						canvasCtx.moveTo(x, y)
					else
						canvasCtx.lineTo(x, y)
				}
				canvasCtx.lineTo(width, height/2)
				canvasCtx.stroke()
			}
		}
		draw()
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
