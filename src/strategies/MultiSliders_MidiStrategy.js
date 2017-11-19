import { startSample, stopSample } from '../actions/sampler'
import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

export default class MultiSliders_MidiStrategy extends MidiStrategy {
	constructor(slidersCount, slidersSteps) {
		super('...') // TODO find input name
		this.slidersCount = slidersCount
		this.slidersSteps = slidersSteps
		this.samplesCount = 32
		this.samplesCountPerSlider = this.samplesCount / this.slidersCount
		this.currentSamples = []
		this.oldSample = -1
		for (let i = 0; i < this.slidersCount; ++i)
			this.currentSamples.push(0)
	}

	handleMidiEvent(dispatch, c, k, v) {
		const sample = (k * this.samplesCountPerSlider) - Math.floor(v * this.samplesCountPerSlider / this.slidersSteps) - 1
		if (v === 0) {
			console.log("stop column")
			dispatch(stopSample(this.oldSample))
			this.currentSamples[k-1] = -1
			return
		}
		if (c === 176 && k >= 1 && k <= this.slidersCount) {
			this.oldSample = this.currentSamples[k-1]
			if (sample !== this.oldSample) {
				// change sample
				console.log("Start sample ", sample)
				dispatch(stopSample(this.oldSample))
				dispatch(startSample(sample))
				this.currentSamples[k-1] = sample
			}
		}
	}
}
