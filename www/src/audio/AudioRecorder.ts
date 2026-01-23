import { AUDIO_EVENT_PLAY, AudioEvent } from './CustomAudio'
import { js_to_b64 } from '../tools'

// ------------------------------------------------------------------

export const RECORD_FORMAT = '1.0'

// ------------------------------------------------------------------

export interface RecordedTrack {
	id: string
	loopStart: number
	loopEnd: number
	preview: string
	providerId: string
	speed: number
	title: string
	url: string
	volume: number
}

export interface RecordData {
	events: number[]
	format: string
	tracks: RecordedTrack[]
}

export interface SamplerTrack {
	id: string
	loopStart: number
	loopEnd: number
	preview: string
	providerId: string
	speed: number
	title: string
	url: string
	volume1: number
	volume2: number
	bpm?: number
}

// ------------------------------------------------------------------

export default class AudioRecorder {
	private _data: RecordData
	private _indexesMapping: Record<number, number> = {} // originalSampleIndex to newSampleIndex

	constructor() {
		this._data = {
			events: [],
			format: RECORD_FORMAT,
			tracks: []
		}
		this._indexesMapping = {}
	}

	pushEvent(currentTime: number, sampleIndex: number, e: AudioEvent, track: SamplerTrack): void {
		let newIndex = this._indexesMapping[sampleIndex]
		if (newIndex === undefined && e[0] === AUDIO_EVENT_PLAY) {
			// TODO: handle speed and gain properly (speed is always 1 in that case)
			const { id, loopStart, loopEnd, preview, providerId, speed, title, url, volume1, volume2 } = track
			this._indexesMapping[sampleIndex] = newIndex = this._data.tracks.length
			this._data.tracks.push({ id, loopStart, loopEnd, preview, providerId, speed, title, url, volume: volume1 * volume2 })
		}
		if (newIndex !== undefined) {
			// only record events of tracks which have been already been played
			// newIndex can be equal to 0
			this._data.events.push(Math.floor(currentTime * 1000), newIndex)
			this._data.events.push.apply(this._data.events, e as number[])
		}
	}

	snapshot(): void {
		console.log('Export Sampling Events', this._data)
		window.open(`/#/play/${js_to_b64(this._data)}`)
	}
}
