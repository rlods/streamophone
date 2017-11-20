import { changePlayerSampleStatus, changePlayerStatus } from '../actions/player'
import CustomAudio, { AUDIO_EVENT_LOOP, AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE, AUDIO_EVENT_SPEED, AUDIO_EVENT_VOLUME } from './CustomAudio'
import { AUDIO_CONTEXT, b64_to_js, Sleeper } from '../tools'
import { RECORD_FORMAT } from './AudioRecorder'

// ------------------------------------------------------------------

export const PLAYER_EVENT_PLAY   = 1
export const PLAYER_EVENT_PAUSE  = 2

const FORCED_STOP_DELAY = 2000 // 2s

// ------------------------------------------------------------------

export default class AudioPlayer
{
	constructor() {
		this._audios = null
		this._canvas = null
		this._dispatch = null
		this._drawing = false
		this._drawingFrameRequest = null
		this._duration = 0
		this._eventCB = e => {
			if      (e[0] === PLAYER_EVENT_PLAY)  this._dispatch(changePlayerStatus(true))
			else if (e[0] === PLAYER_EVENT_PAUSE) this._dispatch(changePlayerStatus(false))
		}
		this._events = []
		this._playing = false
		this._ready = false
		this._sleeper = new Sleeper()
		this._startedAt = 0
		this.tracks = []
	}

	attachDispatcher(dispatch) {
		this._dispatch = dispatch
	}

	async init(data) {
		console.log('Import Sampling Events (b64)', data)
		if (data) {
			data = b64_to_js(data)
			console.log('Import Sampling Events', data)
			const { events, format, tracks } = data
			if (RECORD_FORMAT === format && events.length > 0) {
				this._events = events

				const { duration, durationsPerTrack } = this._processStatistics()
				this._duration = duration / 1000

				this.tracks = tracks.map((track, sampleIndex) => {
					track.playing = false
					track.totalDuration = durationsPerTrack[sampleIndex] / 1000
					return track
				})

				console.log('Loading audios')
				this._audios = await Promise.all(this.tracks.map(async (sample, sampleIndex) => {
					const audio = new CustomAudio(sample.preview, e => {
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
			this._startedAt = AUDIO_CONTEXT.currentTime

			console.log('Starting')
			this._eventCB([PLAYER_EVENT_PLAY])
			this._startVisualization()

			let previousTime = this._events[0], loopStart, loopEnd, speed, volume
			for (let i = 0; i < this._events.length && this._playing; ) {
				const currentTime = this._events[i++]
				const sampleIndex = this._events[i++]
				const eventType   = this._events[i++]
				const delay       = currentTime - previousTime
				if (delay > 0) {
					await this._sleeper.sleep(delay)
					previousTime = currentTime
				}
				if (this._playing) {
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
			}
			
			console.log('Terminated')
			this._audios.forEach(audio => audio.stop()) // Stopping remaining audio (which can occur if playing has been stopped)
			if (this._playing) {
				this._stopVisualization()
				this._eventCB([PLAYER_EVENT_PAUSE])
				this._playing = false
			}
		}
	}

	pause() {
		if (this._playing) {
			this._stopVisualization()
			this._eventCB([PLAYER_EVENT_PAUSE])
			this._playing = false
			this._sleeper.stop()
		}
	}

	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------

	_processStatistics() {
		let duration = 0, previousTime = this._events[0]
		let durationsPerTrack = {}, samplesStarts = {}
		for (let i = 0; i < this._events.length; ) {
			const currentTime = this._events[i++]
			const sampleIndex = this._events[i++]
			const eventType   = this._events[i++]
			const delay       = currentTime - previousTime
			previousTime = currentTime
			duration += delay
			switch (eventType)
			{
			case AUDIO_EVENT_LOOP:
				i++ // loopStart
				i++ // loopEnd
				break
			case AUDIO_EVENT_PLAY:
				samplesStarts[sampleIndex] = currentTime
				break
			case AUDIO_EVENT_PAUSE:
				durationsPerTrack[sampleIndex] = (durationsPerTrack[sampleIndex] || 0) + currentTime - samplesStarts[sampleIndex]
				delete samplesStarts[sampleIndex]
				break
			case AUDIO_EVENT_SPEED:
				i++ // speed
				break
			case AUDIO_EVENT_VOLUME:
				i++ // volume
				break
			default:
				break
			}
		}

		// Forcing stop of unstopped samples
		const startedSamples = Object.entries(samplesStarts)
		if (startedSamples.length > 0) {
			startedSamples.forEach(([sampleIndex, track]) => {
				console.log('Forcing stop of', sampleIndex)
				durationsPerTrack[sampleIndex] = (durationsPerTrack[sampleIndex] || 0) + previousTime + FORCED_STOP_DELAY - samplesStarts[sampleIndex]
				this._events.push(previousTime + FORCED_STOP_DELAY, sampleIndex, AUDIO_EVENT_PAUSE)
			})
			duration += FORCED_STOP_DELAY
		}

		return {
			duration,
			durationsPerTrack
		}
	}

	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------

	attachCanvas(canvas) {
		this._canvas = canvas
		// Do not start visualization else it would loop forever (TODO: understand why)
		// if (this._playing)
		//	this._startVisualization()
	}

	_startVisualization() { // TODO: move outside of AudioPlayer class
		if (this._canvas) {
			const width = this._canvas.width
			const height = this._canvas.width
			const canvasCtx = this._canvas.getContext('2d')
			
			const draw = () => {
				canvasCtx.clearRect(0, 0, width, height)
				if (this._drawingFrameRequest) { // if previous _drawingFrameRequest has been set to null we don't request a new one
					this._drawingFrameRequest = requestAnimationFrame(draw)

					const elapsed = ((AUDIO_CONTEXT.currentTime - this._startedAt) % this._duration) * width / this._duration
					canvasCtx.fillStyle = 'rgb(255, 0, 0)'
					canvasCtx.fillRect(0, 0, elapsed, height)
				}
			}
			this._drawingFrameRequest = requestAnimationFrame(draw)
		}
	}

	_stopVisualization() {
		this._drawingFrameRequest = null
	}
}
