import { startSample, stopSample } from '../../actions/sampling'
import { Strategy } from './'

// --------------------------------------------------------------

const A_CHAR_CODE = 65
const KEY_ORDER_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const KEY_ORDER_AZERTY   = 'azertyuiopqsdfghjklmwxcvbn'

// --------------------------------------------------------------

export default class KeyboardBasicStrategy extends Strategy {
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
}
