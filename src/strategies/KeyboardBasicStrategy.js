import { startSample, stopSample } from '../actions/sampling'
import Strategy from './Strategy'

// --------------------------------------------------------------

const A_CHAR_CODE = 65
const KEY_ORDER_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const KEY_ORDER_AZERTY   = 'azertyuiopqsdfghjklmwxcvbn'
const KEY_ORDER_QWERTY   = 'qwertyuiopasdfghjklzxcvbnm'

// --------------------------------------------------------------

class KeyboardBasicStrategy extends Strategy {
	constructor(keys) {
		super()
		this.keys = keys
		this.samplesCount = 26
	}

	handleKeyDown(dispatch, keyCode) {
		const alphabetIndex = Math.abs(keyCode - A_CHAR_CODE)
		if (alphabetIndex >= 0 && alphabetIndex < 26)
			dispatch(startSample(this.keys.indexOf(KEY_ORDER_ALPHABET[alphabetIndex])))
	}

	handleKeyUp(dispatch, keyCode) {
		const alphabetIndex = Math.abs(keyCode - A_CHAR_CODE)
		if (alphabetIndex >= 0 && alphabetIndex < 26)
			dispatch(stopSample(this.keys.indexOf(KEY_ORDER_ALPHABET[alphabetIndex])))
	}
}

// --------------------------------------------------------------

export class AzertyKeyboardBasicStrategy extends KeyboardBasicStrategy {
	constructor() {
		super(KEY_ORDER_AZERTY)
	}
}

// --------------------------------------------------------------

export class QwertyKeyboardBasicStrategy extends KeyboardBasicStrategy {
	constructor() {
		super(KEY_ORDER_QWERTY)
	}
}
