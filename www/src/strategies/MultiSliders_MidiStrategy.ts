import { startSample, stopSample } from '../actions/sampler'
import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

export default class MultiSliders_MidiStrategy extends MidiStrategy {
	private slidersCount: number
	private slidersSteps: number
	private samplesCountPerSlider: number
	private currentSamples: number[] = []
	private oldSample: number = -1

	constructor(slidersCount: number, slidersSteps: number) {
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

	handleMidiEvent(c: number, k: number, v: number): void {
		const sample = (k * this.samplesCountPerSlider) - Math.floor(v * this.samplesCountPerSlider / this.slidersSteps) - 1
		if (v === 0) {
			console.log("stop column")
			this._dispatch!(stopSample(this.oldSample))
			this.currentSamples[k-1] = -1
			return
		}
		if (c === 176 && k >= 1 && k <= this.slidersCount) {
			this.oldSample = this.currentSamples[k-1]
			if (sample !== this.oldSample) {
				// change sample
				console.log("Start sample ", sample)
				this._dispatch!(stopSample(this.oldSample))
				this._dispatch!(startSample(sample))
				this.currentSamples[k-1] = sample
			}
		}
	}
}
