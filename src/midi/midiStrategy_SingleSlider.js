import { startSample, stopSample, setSampleVolume } from '../actions/sampling'
import MidiStrategy from './midiStrategy'

export default class MidiControllerSlides extends MidiStrategy {
	constructor() {
		super()
		this.currentSample = 0
	}

	handleMessage(dispatch, ch, key, vel) {
		if (ch===176 && key>=1 && key<=8) {
			// change sample
			console.log("Start sample ", vel)
			this.dispatch(stopSample(this.currentSample))
			this.dispatch(startSample(vel))
			this.currentSample = vel
		}
	}
}
