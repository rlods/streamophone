import { startSample, stopSample, changeSamplerSampleVolume } from '../actions/sampler'
import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

const mapping = [42, 46]
const keyDown = 159
const keyUp = 143

// --------------------------------------------------------------

export default class Keyboard_MidiStrategy extends MidiStrategy {
	constructor() {
		super('...') // TODO find input name
		this.samplesCount = 24
	}

	handleMidiEvent(c, k, v) {
		// the key is between 48 and 72
		// channel 144 is key down and 128 keyup
		// velocity works
		if ((k >= 48 && k <= 72) || (mapping.findIndex(other => other === k)) > -1)  {
            const sample = k-48
            console.log(k, c)
            if (c === keyDown) {
                console.log("start sample", sample)
                this._dispatch(startSample(sample))
            } else if (c === keyUp) {
                this._dispatch(stopSample(sample))
            }
            this._dispatch(changeSamplerSampleVolume(sample, v / 128))
		}
	}
}
