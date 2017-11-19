import CustomAudio, { AUDIO_EVENT_LOOP, AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE, AUDIO_EVENT_SPEED, AUDIO_EVENT_VOLUME } from './CustomAudio'
import { sleep, js_to_b64, b64_to_js } from '../tools'

// ------------------------------------------------------------------

const RECORD_FORMAT = '1.0'

// ------------------------------------------------------------------

export default class AudioRecord
{
	constructor(data) {
		this._canvas = null
		this._drawing = false
		this._drawingFrameRequest = null
		if (data) {
			console.log('Import Record (b64)', data)
			this.data = b64_to_js(data)
			console.log('Import Record', this.data)
		}
		else {
			this._indexesMapping = {} // originalSampleIndex to newSampleIndex
			this.data = {
				events: [],
				format: '1.0',
				tracks: []
			}
		}
	}

	pushEvent(currentTime, sampleIndex, e, track) {
		let newIndex = this._indexesMapping[sampleIndex]
		if (e[0] === AUDIO_EVENT_PLAY) {
			if (!newIndex) {
				const { id, loopStart, loopEnd, preview, providerId, speed, title, url, volume1, volume2 } = track
				this._indexesMapping[sampleIndex] = newIndex = this.data.tracks.length
				this.data.tracks.push({ id, loopStart, loopEnd, preview, providerId, speed, title, url, volume: volume1 * volume2 })
			}
		}
		if (newIndex !== undefined) {
			// only record events of tracks which have been already been played
			// newIndex can be equal to 0
			this.data.events.push(Math.floor(currentTime * 1000), newIndex)
			this.data.events.push.apply(this.data.events, e)
		}
	}

	setCanvas(canvas) {
		this._canvas = canvas
	}

	snapshot() {
		console.log('Export Record', this.data)
		window.open('/#/listen/' + js_to_b64(this.data))
	}

	async play() {
		if (this.data) {
			const { events, format, tracks } = this.data
			if (RECORD_FORMAT === format && events.length > 0) {

				console.log('Loading audios')
				const context = new (window.AudioContext || window.webkitAudioContext)()
				const audios = await Promise.all(tracks.map(async track => {
					const audio = new CustomAudio(context, track.preview)
					audio.setLoop(track.loopStart, track.loopEnd)
					audio.setVolume(track.volume)
					await audio.init()
					return audio
				}))

				console.log('Starting')
				this._startVisualization()
				let previousTime = events[0], loopStart, loopEnd, speed, volume
				for (let i = 0; i < events.length; ) {
					const currentTime = events[i++]
					const sampleIndex = events[i++]
					const eventType   = events[i++]
					const delay       = currentTime - previousTime
					if (delay > 0) {
						await sleep(delay)
						previousTime = currentTime
					}
					switch (eventType)
					{
					case AUDIO_EVENT_LOOP:
						loopStart = events[i++]
						loopEnd   = events[i++]
						audios[sampleIndex].setLoop(loopStart, loopEnd)
						break
					case AUDIO_EVENT_PLAY:
						audios[sampleIndex].start()
						break
					case AUDIO_EVENT_PAUSE:
						audios[sampleIndex].stop()
						break
					case AUDIO_EVENT_SPEED:
						speed = events[i++]
						audios[sampleIndex].setSpeed(speed)
						break
					case AUDIO_EVENT_VOLUME:
						volume = events[i++]
						audios[sampleIndex].setVolume(volume)
						break
					default:
						break
					}
				}

				console.log('Terminated')
				this._stopVisualization()
			}
		}
	}

	pause() {
		this._stopVisualization()
	}

	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------

	_startVisualization() { // TODO: move outside of AudioRecord class
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

	_stopVisualization() {
		this._drawingFrameRequest = null
	}
}
