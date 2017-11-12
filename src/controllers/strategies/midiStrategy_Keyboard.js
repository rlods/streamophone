import { startSample, stopSample, setSampleVolume } from '../../actions/sampling'
import Strategy from './Strategy'

// --------------------------------------------------------------

const mapping = [42, 46]
const keyDown = 159
const keyUp = 143

// --------------------------------------------------------------

export default class KeyboardStrategy extends Strategy {
	
	handleMIDI(dispatch, channel, key, velocity) {
		// the key is between 48 and 72
		// channel 144 is key down and 128 keyup
		// velocity works
		if ((key >= 48 && key <= 72) || (mapping.findIndex(other => other == key)) > -1)  {
            const sample = key-48
            console.log(key, channel)
            if (channel === keyDown) {
                console.log("start sample", sample)
                dispatch(startSample(sample))
            } else if (channel === keyUp) {
                dispatch(stopSample(sample))
            }
            dispatch(setSampleVolume(sample, velocity / 128))
		}
	}
}
