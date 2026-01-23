import { startSample, stopSample } from '../actions/sampler'
import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

export default class SingleSlider_MidiStrategy extends MidiStrategy {
	private currentSample: number = 0

	constructor() {
		super('...') // TODO find input name
		this.currentSample = 0
		this.samplesCount = 127
	}

	handleMidiEvent(c: number, k: number, v: number): void {
		if (c === 176 && k >= 1 && k <= 8) {
			console.log("Start sample", v)
			this._dispatch!(stopSample(this.currentSample))
			this._dispatch!(startSample(v))
			this.currentSample = v
		}
	}
}
