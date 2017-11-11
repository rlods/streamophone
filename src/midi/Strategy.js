import { startSample, stopSample } from '../actions/sampling'

// --------------------------------------------------------------

export const StrategyTypes = {
	KEYBOARD_AZERTY: {
		id: 'KEYBOARD_AZERTY',
		label: 'Keyboard Azerty (26 samples)'
	},
	BCF2000_BUTTONS: {
		id: 'BCF2000_BUTTONS',
		label: 'BCF2000 - Buttons (8 samples)'
	},
	BCF2000_SINGLESLIDER: {
		id: 'BCF2000_SINGLESLIDER',
		label: 'BCF2000 - 1 Slider (127 samples)'
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
	},
	CUSTOM_SOCKET_STRATEGY: {
		id: 'CUSTOM_SOCKET_STRATEGY',
		label: 'CUSTOM_SOCKET_STRATEGY (10 samples)'
	}
}

// --------------------------------------------------------------

const A_CHAR_CODE = 65
const KEY_ORDER_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const KEY_ORDER_AZERTY   = 'azertyuiopqsdfghjklmwxcvbn'

// --------------------------------------------------------------

export default class MidiStrategy {
	handleMIDI(dispatch, channel, key, velocity) {
	}

	handleKeyDown(dispatch, keyCode) {
		const alphabetIndex = Math.abs(keyCode - A_CHAR_CODE)
		if (alphabetIndex >= 0 && alphabetIndex < 26)
			dispatch(startSample(KEY_ORDER_AZERTY.indexOf(KEY_ORDER_ALPHABET[alphabetIndex])))
	}

	handleKeyUp(dispatch, keyCode) {
		const alphabetIndex = Math.abs(keyCode - A_CHAR_CODE)
		if (alphabetIndex >= 0 && alphabetIndex < 26)
			dispatch(stopSample(KEY_ORDER_AZERTY.indexOf(KEY_ORDER_ALPHABET[alphabetIndex])))
	}

	handleWebSocket(dispatch, message) {
	}
}
