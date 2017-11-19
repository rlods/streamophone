import { AUDIO_EVENT_PLAY } from './CustomAudio'
import { js_to_b64 } from '../tools'

// ------------------------------------------------------------------

export const RECORD_FORMAT = '1.0'

// ------------------------------------------------------------------

export default class AudioRecorder
{
	constructor() {
		this._indexesMapping = {} // originalSampleIndex to newSampleIndex
		this.data = {
			events: [],
			format: RECORD_FORMAT,
			tracks: []
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

	snapshot() {
		console.log('Export Sampling Events', this.data)
		window.open('/#/listen/' + js_to_b64(this.data))
	}
}
