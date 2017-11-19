import { changePlayerSampleStatus, changePlayerStatus } from '../actions/player'
import CustomAudio, { AUDIO_EVENT_LOOP, AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE, AUDIO_EVENT_SPEED, AUDIO_EVENT_VOLUME } from './CustomAudio'
import { sleep, b64_to_js } from '../tools'
import { RECORD_FORMAT } from './AudioRecorder'

// ------------------------------------------------------------------

export const PLAYER_EVENT_PLAY   = 1
export const PLAYER_EVENT_PAUSE  = 2

// ------------------------------------------------------------------

export default class AudioPlayer
{
	constructor() {
		this._audios = null
		this._canvas = null
		this._dispatch = null
		this._drawing = false
		this._drawingFrameRequest = null
		this._eventCB = e => {
			if      (e[0] === PLAYER_EVENT_PLAY)  this._dispatch(changePlayerStatus(true))
			else if (e[0] === PLAYER_EVENT_PAUSE) this._dispatch(changePlayerStatus(false))
		}
		this._events = []
		this._playing = false
		this._ready = false
		this.tracks = []
	}

	attach(dispatch) {
		this._dispatch = dispatch
	}

	attachCanvas(canvas) {
		this._canvas = canvas
		if (this._playing)
			this._startVisualization()
	}

	async loadData(data) {
		console.log('Import Sampling Events (b64)', data)
		if (data) {
			data = b64_to_js(data)
			console.log('Import Sampling Events', data)
			const { events, format, tracks } = data
			if (RECORD_FORMAT === format) {
				this._events = events
				this.tracks = tracks.map(track => {
					track.playing = false
					return track
				})

				console.log('Loading audios')
				const context = new (window.AudioContext || window.webkitAudioContext)()
				this._audios = await Promise.all(this.tracks.map(async (sample, sampleIndex) => {
					const audio = new CustomAudio(context, sample.preview, e => {
						if      (e[0] === AUDIO_EVENT_PLAY)  this._dispatch(changePlayerSampleStatus(sampleIndex, true))
						else if (e[0] === AUDIO_EVENT_PAUSE) this._dispatch(changePlayerSampleStatus(sampleIndex, false))
					})
					audio.setLoop(sample.loopStart, sample.loopEnd)
					audio.setVolume(sample.volume)
					await audio.init()
					return audio
				}))

				this._ready = true
			}
		}
	}

	async play() {
		if (this._ready && !this._playing) {
			this._playing = true

			console.log('Starting')
			this._eventCB([PLAYER_EVENT_PLAY])
			this._startVisualization()

			let previousTime = this._events[0], loopStart, loopEnd, speed, volume
			for (let i = 0; i < this._events.length; ) {
				const currentTime = this._events[i++]
				const sampleIndex = this._events[i++]
				const eventType   = this._events[i++]
				const delay       = currentTime - previousTime
				if (delay > 0) {
					await sleep(delay)
					previousTime = currentTime
				}
				switch (eventType)
				{
				case AUDIO_EVENT_LOOP:
					loopStart = this._events[i++]
					loopEnd   = this._events[i++]
					this._audios[sampleIndex].setLoop(loopStart, loopEnd)
					break
				case AUDIO_EVENT_PLAY:
					this._audios[sampleIndex].start()
					break
				case AUDIO_EVENT_PAUSE:
					this._audios[sampleIndex].stop()
					break
				case AUDIO_EVENT_SPEED:
					speed = this._events[i++]
					this._audios[sampleIndex].setSpeed(speed)
					break
				case AUDIO_EVENT_VOLUME:
					volume = this._events[i++]
					this._audios[sampleIndex].setVolume(volume)
					break
				default:
					break
				}
			}

			console.log('Terminated')
			this._stopVisualization()
			this._eventCB([PLAYER_EVENT_PAUSE])
			this._playing = false
		}
	}

	pause() {
		if (this._playing) {
			alert('TODO: stop music')
			this._stopVisualization()
			this._eventCB([PLAYER_EVENT_PAUSE])
			this._playing = false
		}
	}

	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------

	_startVisualization() { // TODO: move outside of AudioPlayer class
		if (this._canvas) {
			const width = this._canvas.width
			const height = this._canvas.width
			const canvasCtx = this._canvas.getContext('2d')
			
			const draw = () => {
				canvasCtx.clearRect(0, 0, width, height)
				if (this._drawingFrameRequest) { // if previous _drawingFrameRequest has been set to null we don't request a new one
					this._drawingFrameRequest = requestAnimationFrame(draw)

					//  const elapsed = ((this._context.currentTime - this._startedAt) % duration) * width / duration

					canvasCtx.fillStyle = 'rgb(255, 0, 0)'
					//canvasCtx.fillRect(0, 0, elapsed, height)
					canvasCtx.fillRect(0, 0, width, height)
				}
			}
			this._drawingFrameRequest = requestAnimationFrame(draw)
		}
	}

	_stopVisualization() {
		this._drawingFrameRequest = null
	}
}
