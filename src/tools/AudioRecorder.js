import { AUDIO_EVENT_PLAY } from './CustomAudio'
import config from '../config'
import { js_to_b64 } from '../tools'

// ------------------------------------------------------------------

export const RECORD_FORMAT = '1.0'

// ------------------------------------------------------------------

export default class AudioRecorder
{
	constructor() {
		this._data = {
			events: [],
			format: RECORD_FORMAT,
			tracks: []
		}
		this._indexesMapping = {} // originalSampleIndex to newSampleIndex
	}

	pushEvent(currentTime, sampleIndex, e, track) {
		let newIndex = this._indexesMapping[sampleIndex]
		if (newIndex === undefined && e[0] === AUDIO_EVENT_PLAY) {
			const { id, loopStart, loopEnd, preview, providerId, speed, title, url, volume1, volume2 } = track
			this._indexesMapping[sampleIndex] = newIndex = this._data.tracks.length
			this._data.tracks.push({ id, loopStart, loopEnd, preview, providerId, speed, title, url, volume: volume1 * volume2 })
		}
		if (newIndex !== undefined) {
			// only record events of tracks which have been already been played
			// newIndex can be equal to 0
			this._data.events.push(Math.floor(currentTime * 1000), newIndex)
			this._data.events.push.apply(this._data.events, e)
		}
	}

	snapshot() {
		console.log('Export Sampling Events', this._data)
		window.open(`${config.BASE_URL}/#/play/${js_to_b64(this._data)}`)
	}
}
