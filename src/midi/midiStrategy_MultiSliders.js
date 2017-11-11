import { startSample, stopSample } from '../actions/sampling'
import MidiStrategy from './midiStrategy'

export default class MidiControllerMultiSliders extends MidiStrategy {
	constructor() {
		super()
		this.slidersCount = 8 // TODO: configurable
		this.slidersSteps = 128 // TODO: configurable
		this.currentSamples = []
		this.oldSample = -1
		for (let i = 0; i < this.slidersCount; ++i)
			this.currentSamples.push(0)
	}

	handleMessage(dispatch, ch, key, vel) {
		const samplesCountPerSlider = this.samplesCount / this.slidersCount
		const sample = (key * samplesCountPerSlider) - Math.floor(vel * samplesCountPerSlider / this.slidersSteps) - 1
		if (vel === 0) {
			console.log("stop column")
			dispatch(stopSample(this.oldSample))
			this.currentSamples[key-1] = -1
			return
		}
		if (ch === 176 && key >= 1 && key <= this.slidersCount) {
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
