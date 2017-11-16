
const AUDIO_CONTEXT = new (window.AudioContext || window.webkitAudioContext)()

// ------------------------------------------------------------------

export default class CustomAudio
{
	constructor(url) {
		this.ready = false
		this.onStop = null
		this._audioBuffer = null
		this._gainNode = AUDIO_CONTEXT.createGain()
		this._gainNode.gain.value = 1.0
		this._gainNode.connect(AUDIO_CONTEXT.destination)
		this._loop = false
		this._sourceNode = null
		this._speed = 1.0
		this._url = url
	}

	setLoop(loop) {
		this._loop = loop
		if (null !== this._sourceNode)
			this._sourceNode.loop = loop
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
			this._sourceNode.onended = this.onStop
			this._sourceNode.connect(this._gainNode)
			this._sourceNode.start() // NOTE that a new BufferSource must be created for each start
		}
	}

	stop() {
		if (null !== this._sourceNode) {
			this._sourceNode.stop() // NOTE that a new BufferSource must be created for each start
			this._sourceNode = null
			if (null !== this.onStop)
				this.onStop()
		}
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
