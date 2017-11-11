import { startSample, stopSample } from '../actions/sampling'

export default class MidiControllerMultilides {
	constructor() {
		this.slidersCount = 8 // TODO: configurable
		this.slidersSteps = 128 // TODO: configurable
		this.currentSamples = []
		for (let i = 0; i < this.slidersCount; ++i)
			this.currentSamples.push(0)
	}

	handleMessage(dispatch, ch, key, vel) {
		const sample = (key * 8) - Math.floor(vel * 8 / this.slidersSteps) - 1
		if (ch === 176 && key >= 1 && key <= this.slidersCount) {
			const oldSample = this.currentSamples[key-1]
			if (sample !== oldSample) {
				// change sample
				console.log("Start sample ", sample)
				dispatch(stopSample(oldSample))
				dispatch(startSample(sample))
				this.currentSamples[key-1] = sample
			}
		}
	}
}
