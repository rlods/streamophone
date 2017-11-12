
const StrategyDefinitions = {
	KEYBOARD_AZERTY: {
		controllerId: 'basic',
		label: 'Keyboard Azerty (26 samples)',
		samplingCount: 26
	},
	BCF2000_BUTTONS: {
		controllerId: 'midi',
		label: 'BCF2000 - Buttons (8 samples)',
		samplingCount: 8
	},
	BCF2000_SINGLESLIDER: {
		controllerId: 'midi',
		label: 'BCF2000 - 1 Slider (127 samples)',
		samplingCount: 127
	},
	BCF2000_MULTISLIDERS_8_32: {
		controllerId: 'midi',
		label: 'BCF2000 - 8 Sliders (32 samples)',
		samplingCount: 32
	},
	BCF2000_MULTISLIDERS_8_64: {
		controllerId: 'midi',
		label: 'BCF2000 - 8 Sliders (64 samples)',
		samplingCount: 64
	},
	LIGHTPADBLOCK_16: {
		controllerId: 'midi',
		label: 'ROLI LightPadBlock (16 samples)',
		samplingCount: 16
	},
	KEYBOARD_24: {
		controllerId: 'midi',
		label: 'OXYGEN25 (32 samples)',
		samplingCount: 24
	},
	CUSTOM_SOCKET_STRATEGY: {
		controllerId: 'socket',
		label: 'CUSTOM_SOCKET_STRATEGY (25 samples)',
		samplingCount: 25
	}
}

export default StrategyDefinitions
