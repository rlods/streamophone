import CustomAudio, { AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE, AUDIO_EVENT_SPEED, AUDIO_EVENT_VOLUME, AUDIO_EVENT_LOOP } from './CustomAudio'
import { sleep, js_to_b64, b64_to_js } from '../tools'

// ------------------------------------------------------------------

const RECORD_FORMAT = '1.0'

// ------------------------------------------------------------------

export default class AudioRecord
{
	constructor(data)
	{
		this._canvas = null
		if (data) {
			console.log('Import Record (b64)', data)
			this.data = b64_to_js(data)
			console.log('Import Record', this.data)
		}
		else {
			this.data = { // sampleIndex will become a dictionary key in that case
				events: [],
				format: '1.0',
				tracks: {}
			}
		}
	}

	pushEvent(currentTime, sampleIndex, e, track) {
		if (e[0] === AUDIO_EVENT_PLAY) {
			if (!this.data.tracks[sampleIndex]) {
				const { id, loopStart, loopEnd, preview, providerId, speed, title, url, volume1, volume2 } = track
				this.data.tracks[sampleIndex] = { id, loopStart, loopEnd, preview, providerId, speed, title, url, volume: volume1 * volume2 }
			}
		}
		if (this.data.tracks[sampleIndex]) {
			// only record events of tracks which have been already been played
			e.splice(0, 0, Math.floor(currentTime * 1000), sampleIndex) // time and index at the beginning of the event (which is an array)
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
			const audios = {}
			await Promise.all(Object.entries(this.data.tracks).map(async ([sampleIndex, track]) => {
				const audio = new CustomAudio(context, track.preview)
				audio.setLoop(track.loopStart, track.loopEnd)
				audio.setVolume(track.volume)
				await audio.init()
				audios[sampleIndex] = audio
			}))

			console.log('Starting')
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
				case AUDIO_EVENT_LOOP:
					audios[sampleIndex].setLoop(e[3], e[4])
					break
				default:
					break
				}
			}))

			console.log('Terminated')
		}
	}
}
