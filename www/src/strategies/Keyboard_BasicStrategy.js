import { startSample, stopSample } from '../actions/sampler'
import Strategy from './Strategy'
import { KEY_ORDER_AZERTY, KEY_ORDER_QWERTY } from '../tools'

// --------------------------------------------------------------

const A_CHAR_CODE = 65
const KEY_ORDER_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

// --------------------------------------------------------------

class Keyboard_BasicStrategy extends Strategy {
	constructor(keys) {
		super()
		this.keys = keys
		this.samplesCount = 26
	}

	handleKeyDown(keyCode) {
		const alphabetIndex = Math.abs(keyCode - A_CHAR_CODE)
		if (alphabetIndex >= 0 && alphabetIndex < 26)
			this._dispatch(startSample(this.keys.indexOf(KEY_ORDER_ALPHABET[alphabetIndex])))
	}

	handleKeyUp(keyCode) {
		const alphabetIndex = Math.abs(keyCode - A_CHAR_CODE)
		if (alphabetIndex >= 0 && alphabetIndex < 26)
			this._dispatch(stopSample(this.keys.indexOf(KEY_ORDER_ALPHABET[alphabetIndex])))
	}
}

// --------------------------------------------------------------

export class AzertyKeyboard_BasicStrategy extends Keyboard_BasicStrategy {
	constructor() {
		super(KEY_ORDER_AZERTY)
	}
}

// --------------------------------------------------------------

export class QwertyKeyboard_BasicStrategy extends Keyboard_BasicStrategy {
	constructor() {
		super(KEY_ORDER_QWERTY)
	}
}
