import { startSample, stopSample } from '../../actions/sampling'
import Strategy from './Strategy'

// --------------------------------------------------------------

export default class MultiSlidersStrategy extends Strategy {
	constructor(slidersCount, slidersSteps) {
		super()
		this.slidersCount = slidersCount
		this.slidersSteps = slidersSteps
		this.samplesCount = 32
		this.samplesCountPerSlider = this.samplesCount / this.slidersCount
		this.currentSamples = []
		this.oldSample = -1
		for (let i = 0; i < this.slidersCount; ++i)
			this.currentSamples.push(0)
	}

	handleMIDI(dispatch, channel, key, velocity) {
		const sample = (key * this.samplesCountPerSlider) - Math.floor(velocity * this.samplesCountPerSlider / this.slidersSteps) - 1
		if (velocity === 0) {
			console.log("stop column")
			dispatch(stopSample(this.oldSample))
			this.currentSamples[key-1] = -1
			return
		}
		if (channel === 176 && key >= 1 && key <= this.slidersCount) {
			this.oldSample = this.currentSamples[key-1]
			if (sample !== this.oldSample) {
				// change sample
				console.log("Start sample ", sample)
				dispatch(stopSample(this.oldSample))
				dispatch(startSample(sample))
				this.currentSamples[key-1] = sample
			}
		}
	}
}
