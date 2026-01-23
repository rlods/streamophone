import Strategy from './Strategy'
import { KEY_ORDER_AZERTY, KEY_ORDER_QWERTY } from '../tools'

// --------------------------------------------------------------

const A_CHAR_CODE = 65
const KEY_ORDER_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

// --------------------------------------------------------------

class Keyboard_BasicStrategy extends Strategy {
	protected keys: string

	constructor(keys: string) {
		super()
		this.keys = keys
		this.samplesCount = 26
	}

	handleKeyDown(keyCode: number): void {
		const alphabetIndex = Math.abs(keyCode - A_CHAR_CODE)
		if (alphabetIndex >= 0 && alphabetIndex < 26)
			this._dispatch!({ type: 'SAMPLER_START_SAMPLE', data: { sampleIndex: this.keys.indexOf(KEY_ORDER_ALPHABET[alphabetIndex]) } })
	}

	handleKeyUp(keyCode: number): void {
		const alphabetIndex = Math.abs(keyCode - A_CHAR_CODE)
		if (alphabetIndex >= 0 && alphabetIndex < 26)
			this._dispatch!({ type: 'SAMPLER_STOP_SAMPLE', data: { sampleIndex: this.keys.indexOf(KEY_ORDER_ALPHABET[alphabetIndex]) } })
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
