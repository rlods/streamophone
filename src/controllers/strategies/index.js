
export const StrategyTypes = {
	KEYBOARD_AZERTY: {
		id: 'KEYBOARD_AZERTY',
		label: 'Keyboard Azerty (26 samples)',
		controllerType: 'basic'
	},
	BCF2000_BUTTONS: {
		id: 'BCF2000_BUTTONS',
		label: 'BCF2000 - Buttons (8 samples)',
		controllerType: 'midi'
	},
	BCF2000_SINGLESLIDER: {
		id: 'BCF2000_SINGLESLIDER',
		label: 'BCF2000 - 1 Slider (127 samples)',
		controllerType: 'midi'
	},
	BCF2000_MULTISLIDERS_8_32: {
		id: 'BCF2000_MULTISLIDERS_8_32',
		label: 'BCF2000 - 8 Sliders (32 samples)',
		controllerType: 'midi'
	},
	BCF2000_MULTISLIDERS_8_64: {
		id: 'BCF2000_MULTISLIDERS_8_64',
		label: 'BCF2000 - 8 Sliders (64 samples)',
		controllerType: 'midi'
	},
	LIGHTPADBLOCK_16: {
		id: 'LIGHTPADBLOCK_16',
		label: 'ROLI LightPadBlock (16 samples)',
		controllerType: 'midi'
	},
	KEYBOARD_24: {
		id: 'KEYBOARD_24',
		label: 'OXYGEN25 (32 samples)',
		controllerType: 'midi'
	},
	CUSTOM_SOCKET_STRATEGY: {
		id: 'CUSTOM_SOCKET_STRATEGY',
		label: 'CUSTOM_SOCKET_STRATEGY (25 samples)',
		controllerType: 'socket'
	}
}

// --------------------------------------------------------------

export class Strategy {
	handleMIDI(dispatch, channel, key, velocity) {
	}

	handleKeyDown(dispatch, keyCode) {
	}

	handleKeyUp(dispatch, keyCode) {
	}

	handleWebSocket(dispatch, message) {
	}
}
