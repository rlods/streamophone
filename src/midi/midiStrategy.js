import { startSample, stopSample } from '../actions/sampling'

// --------------------------------------------------------------

export const StrategyTypes = {
	BCF2000_BUTTONS_32: {
		id: 'BCF2000_BUTTONS_32',
		label: 'BCF2000 - Buttons (32 samples)'
	},
	BCF2000_BUTTONS_64: {
		id: 'BCF2000_BUTTONS_64',
		label: 'BCF2000 - Buttons (64 samples)'
	},
	BCF2000_SINGLESLIDER_32: {
		id: 'BCF2000_SINGLESLIDER_32',
		label: 'BCF2000 - Single Slider (32 samples)'
	},
	BCF2000_SINGLESLIDER_64: {
		id: 'BCF2000_SINGLESLIDER_64',
		label: 'BCF2000 - Single Slider (64 samples)'
	},
	BCF2000_MULTISLIDERS_8_32: {
		id: 'BCF2000_MULTISLIDERS_8_32',
		label: 'BCF2000 - 8 Sliders (32 samples)'
	},
	BCF2000_MULTISLIDERS_8_64: {
		id: 'BCF2000_MULTISLIDERS_8_64',
		label: 'BCF2000 - 8 Sliders (64 samples)'
	},
	LIGHTPADBLOCK_32: {
		id: 'LIGHTPADBLOCK_32',
		label: 'LIGHTPADBLOCK (32 samples)'
	}
}

// --------------------------------------------------------------

const A_CHAR_CODE = 65

// --------------------------------------------------------------

export default class MidiStrategy {
	handleMessage(dispatch, channel, key, velocity) {
	}

	handleKeyDown(dispatch, keyCode) {
		dispatch(startSample(keyCode - A_CHAR_CODE))
	}

	handleKeyUp(dispatch, keyCode) {
		dispatch(stopSample(keyCode - A_CHAR_CODE))
	}

}
