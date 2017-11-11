import { startSample, stopSample } from '../actions/sampling'
import Strategy from './Strategy'

export default class SingleSliderStrategy extends Strategy {
	constructor() {
		super()
		this.currentSample = 0
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
