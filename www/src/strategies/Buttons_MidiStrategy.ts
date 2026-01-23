import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

export default class Buttons_MidiStrategy extends MidiStrategy {
	constructor() {
		super('...') // TODO find input name
		this.samplesCount = 8
	}

	handleMidiEvent(c: number, k: number, v: number): void {
		if (c === 176 && k >= 1 && k <= 8) {
			// change volume of k-1
			console.log("Change volume of ", k-1, " to ", v/127)
			this._dispatch!({ type: 'SAMPLER_SET_SAMPLE_VOLUME', data: { sampleIndex: k-1, volume: v/127 } })
		}
		else {
			// start one sample
			const val = c + "-" + k
			let sample = -1
			switch (val)
			{
				case "176-0":
					sample=0
					break
				case "177-6":
					sample=1
					break
				case "178-6":
					sample=2
					break
				case "179-6":
					sample=3
					break
				case "176-77":
					sample=4
					break
				case "176-78":
					sample=5
					break
				case "176-79":
					sample=6
					break
				case "176-80":
					sample=7
					break
				default:
					sample=-1
					break
			}
			if (sample!==-1) {
				if (v === 0) {
					console.log("stop sample ", sample)
					this._dispatch!({ type: 'SAMPLER_STOP_SAMPLE', data: { sampleIndex: sample } })
				} else if (v === 127) {
					console.log("start sample ", sample)
					this._dispatch!({ type: 'SAMPLER_START_SAMPLE', data: { sampleIndex: sample } })
				}
			}
		}
	}
}
