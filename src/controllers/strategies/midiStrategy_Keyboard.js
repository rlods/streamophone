import { startSample, stopSample, setSampleVolume } from '../../actions/sampling'
import { Strategy } from './'

// --------------------------------------------------------------

const mapping = [42, 46]

// --------------------------------------------------------------

export default class KeyboardStrategy extends Strategy {
	
	handleMIDI(dispatch, channel, key, velocity) {
		// the key is between 48 and 72
		// channel 144 is key down and 128 keyup
		// velocity works
		if ((key >= 48 && key <= 72) || (mapping.findIndex(other => other === key)) > -1) {
		    if (channel === 144) {
		        dispatch(startSample(key-48))
		    }
		    else if (channel === 128) {
		        dispatch(stopSample(key-48))
		    }
			dispatch(setSampleVolume(key-48, velocity / 128))
		}
	}
}
