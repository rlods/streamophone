import { startSample, stopSample } from '../actions/sampling'
import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

export default class SingleSlider_MidiStrategy extends MidiStrategy {
	constructor() {
		super('...') // TODO find input name
		this.currentSample = 0
		this.samplesCount = 127
	}

	handleMidiEvent(dispatch, c, k, v) {
		if (c === 176 && k >= 1 && k <= 8) {
			console.log("Start sample", v)
			dispatch(stopSample(this.currentSample))
			dispatch(startSample(v))
			this.currentSample = v
		}
	}
}
