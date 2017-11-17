import { startSample, stopSample } from '../actions/sampling'
import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

export default class SingleSlider_MidiStrategy extends MidiStrategy {
	constructor() {
		super('...') // TODO find input name
		this.currentSample = 0
		this.samplesCount = 127
	}

	handleMIDI(dispatch, channel, key, velocity) {
		if (channel === 176 && key >= 1 && key <= 8) {
			console.log("Start sample", velocity)
			dispatch(stopSample(this.currentSample))
			dispatch(startSample(velocity))
			this.currentSample = velocity
		}
	}
}
