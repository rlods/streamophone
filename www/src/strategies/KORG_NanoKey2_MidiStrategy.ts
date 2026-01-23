import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

const mapping: number[] = [42, 46]
const keyDown = 144
const keyUp = 128

// --------------------------------------------------------------

export default class KORG_NanoKey2_MidiStrategy extends MidiStrategy {
	constructor() {
		super('...') // TODO find input name
		this.samplesCount = 25
	}

	handleMidiEvent(c: number, k: number, v: number): void {
		// the key is between 48 and 72
		// c 144 is key down and 128 keyup
		// velocity works
		if ((k >= 48 && k <= 72) || (mapping.findIndex(other => other === k)) > -1)  {
			const sample = k-48
			console.log(k, c)
			if (c === keyDown) {
				console.log("start sample", sample)
				this._callbacks?.onStartSample(sample)
			} else if (c === keyUp) {
				this._callbacks?.onStopSample(sample)
			}
			this._callbacks?.onSampleVolumeChange(sample, v / 128)
		}
	}
}
