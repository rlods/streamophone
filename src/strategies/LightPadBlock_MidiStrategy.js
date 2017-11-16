import { startSample, stopSample } from '../actions/sampling'
import Strategy from './Strategy'

// --------------------------------------------------------------

const keyMapping = {
	51:  0,
	55:  1,
	59:  2,
	63:  3,
	50:  4,
	54:  5,
	58:  6,
	62:  7,
	49:  8,
	53:  9,
	57: 10,
	61: 11,
	48: 12,
	52: 13,
	56: 14,
	60: 15
}

// --------------------------------------------------------------

export default class LightPadBlock_MidiStrategy extends Strategy {
	constructor() {
		super()
		this.samplesCount = 16
	}

	handleMIDI(dispatch, channel, key, velocity) {
		// messages are given four by four
		if (key >= 48 && key <= 63 && channel < 209) {
			console.log("k", key, "c", channel, "v", velocity)
			const mapping = keyMapping[key]
			if (mapping !== undefined) {
				console.log("m", mapping)
				if (channel>=145 && channel<160) {
					dispatch(startSample(mapping))
				}
				else if (channel<145 && channel>=129) {
					dispatch(stopSample(mapping))
				}
			}
		}
	}
}
