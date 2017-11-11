import { startSample, stopSample, setSampleVolume } from '../actions/sampling'
import MidiStrategy from './midiStrategy'

let msgNum = 0

const keyMapping = {
    51: [0, 152, 136],
    55: [1, 153, 137],
    59: [2, 151, 135],
    63: [3, 155, 139],
    50: [4, 146, 130],
    54: [5, 148, 132],
    58: [6, 149, 133],
    62: [7, 156, 140],
    49: [8, 157, 141],
    53: [9, 158, 142],
    57: [10, 159, 143],
    61: [11, 159, 143],
    48: [12, 146, 130],
    52: [13, 150, 134],
    56: [14, 154, 138],
    60: [15, 147, 131]
}

export default class Strategy extends MidiStrategy {
	
	handleMessage(dispatch, channel, key, velocity) {
		// messages are given four by four
		if (key >= 48 && key <= 63 && channel < 209) {
			console.log("key", key, "channel", channel)
            if (keyMapping[key]) {
                const mapping = keyMapping[key]
                if (channel===mapping[1]) {
                    dispatch(startSample(mapping[0]))
                } else if (channel===mapping[2]) {
                    dispatch(stopSample(mapping[0]))
                }
            }
		}
	}
}
