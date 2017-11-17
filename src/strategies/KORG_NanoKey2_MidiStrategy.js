import { startSample, stopSample, changeSampleVolume } from '../actions/sampling'
import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

const mapping = [42, 46]
const keyDown = 144
const keyUp = 128

// --------------------------------------------------------------

export default class KORG_NanoKey2_MidiStrategy extends MidiStrategy {
	constructor() {
		super('...') // TODO find input name
		this.samplesCount = 25
	}

	handleMidiEvent(dispatch, c, k, v) {
		// the key is between 48 and 72
		// c 144 is key down and 128 keyup
		// velocity works
		if ((k >= 48 && k <= 72) || (mapping.findIndex(other => other === k)) > -1)  {
            const sample = k-48
            console.log(k, c)
            if (c === keyDown) {
                console.log("start sample", sample)
                dispatch(startSample(sample))
            } else if (c === keyUp) {
                dispatch(stopSample(sample))
            }
            dispatch(changeSampleVolume(sample, v / 128))
		}
	}
}
