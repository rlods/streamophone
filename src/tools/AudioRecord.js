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
		if (newIndex !== undefined) { // can be equal to 0
			// only record events of tracks which have been already been played
			e.splice(0, 0, Math.floor(currentTime * 1000), newIndex) // time and index at the beginning of the event (which is an array)
			this.data.events.push(e)
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
		if (this.data && RECORD_FORMAT === this.data.format && this.data.events.length > 0) {
			console.log('Loading audios')
			const context = new (window.AudioContext || window.webkitAudioContext)()
			const audios = await Promise.all(this.data.tracks.map(async track => {
				const audio = new CustomAudio(context, track.preview)
				audio.setLoop(track.loopStart, track.loopEnd)
				audio.setVolume(track.volume)
				await audio.init()
				return audio
			}))

			console.log('Starting')
			this._startVisualization()
			let previousTime = this.data.events[0][0]
			await Promise.all(this.data.events.map(async e => {
				const [ currentTime, sampleIndex, eventType ] = e
				const delay = currentTime - previousTime
				if (delay > 0) {
					await sleep(delay)
					previousTime = currentTime
				}
				switch (eventType)
				{
				case AUDIO_EVENT_LOOP:
					audios[sampleIndex].setLoop(e[3], e[4])
					break
				case AUDIO_EVENT_PLAY:
					audios[sampleIndex].start()
					break
				case AUDIO_EVENT_PAUSE:
					audios[sampleIndex].stop()
					break
				case AUDIO_EVENT_SPEED:
					audios[sampleIndex].setSpeed(e[3])
					break
				case AUDIO_EVENT_VOLUME:
					audios[sampleIndex].setVolume(e[3])
					break
				default:
					break
				}
			}))

			console.log('Terminated')
			this._stopVisualization()
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
