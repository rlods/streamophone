import { startSample, stopSample } from '../actions/sampler'
import MidiStrategy from './MidiStrategy'

// --------------------------------------------------------------

class LightPadBlock_MidiStrategy extends MidiStrategy {
	constructor(mapping, samplesCount) {
		super('Lightpad BLOCK')
		this.mapping = mapping
		this.samplesCount = samplesCount
	}

	handleMidiEvent(dispatch, c, k, v) {
		// messages are given four by four
		if (k >= 48 && k <= 63 && c < 209) {
			console.log("k", k, "c", c, "v", v)
			const m = this.mapping[k]
			if (m !== undefined) {
				if (c >= 145 && c < 160) {
					dispatch(startSample(m))
				}
				else if (c < 145 && c >= 129) {
					dispatch(stopSample(m))
				}
			}
		}
	}
}

// --------------------------------------------------------------

const keyMapping16 = {
	48:  0,
	49:  1,
	50:  2,
	51:  3,
	52:  4,
	53:  5,
	54:  6,
	55:  7,
	56:  8,
	57:  9,
	58: 10,
	59: 11,
	60: 12,
	61: 13,
	62: 14,
	63: 15,
}

export class LightPadBlock16_MidiStrategy extends LightPadBlock_MidiStrategy {
	constructor() {
		super(keyMapping16, 16)
	}
}

// --------------------------------------------------------------

const keyMapping4 = {
	48: 0,
	49: 1,
	50: 2,
	51: 3,
}

export class LightPadBlock4_MidiStrategy extends LightPadBlock_MidiStrategy {
	constructor() {
		super(keyMapping4, 4)
	}
}
