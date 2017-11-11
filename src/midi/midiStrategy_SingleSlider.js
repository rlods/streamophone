import { startSample, stopSample, setSampleVolume } from '../actions/sampling'
import MidiStrategy from './midiStrategy'

export default class MidiControllerSlides extends MidiStrategy {
	constructor() {
		super()
		this.currentSample = 0
	}

	handleMessage(dispatch, channel, key, velocity) {
		if (channel === 176 && key >= 1 && key <= 8) {
			console.log("Start sample", velocity)
			this.dispatch(stopSample(this.currentSample))
			this.dispatch(startSample(velocity))
			this.currentSample = velocity
		}
	}
}
