import { startSample, stopSample } from '../actions/sampling'
import Strategy from './Strategy'

// --------------------------------------------------------------

export default class KORG_NanoKey2_Strategy extends Strategy {
	constructor() {
		super()
		this.samplesCount = 25
	}

	handleMIDI(dispatch, channel, key, velocity) {
		// TODO
	}
}
