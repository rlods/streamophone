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

	handleMIDI(dispatch, channel, key, velocity) {
		// the key is between 48 and 72
		// channel 144 is key down and 128 keyup
		// velocity works
		if ((key >= 48 && key <= 72) || (mapping.findIndex(other => other === key)) > -1)  {
            const sample = key-48
            console.log(key, channel)
            if (channel === keyDown) {
                console.log("start sample", sample)
                dispatch(startSample(sample))
            } else if (channel === keyUp) {
                dispatch(stopSample(sample))
            }
            dispatch(changeSampleVolume(sample, velocity / 128))
		}
	}
}
