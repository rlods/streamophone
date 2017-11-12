
const Config = {

	CURATED_PLAYLISTS: [
		{ id: 1083902971, title: 'Hits 2017' },
		{ id: 791313621,  title: 'The Greatest Piano Classics' },
		{ id: 548368765,  title: 'Long Playlist' },
		{ id: 3789105302, title: 'Steve Reich' },
		{ id: 10178447,   title: 'Percus' },
		{ id: 3791846562, title: 'Speeches' },
		{ id: 1194890603, title: 'Best of Daft Punk' },
		{ id: 771276181,  title: 'Musique concrète et électronique' },
		{ id: 3510240466, title: 'Soul to Funk' },
		{ id: 23804156,   title: 'Minimal electro house' }
	],

	ENABLE_LOGGER: false, // process.env.NODE_ENV !== 'production'

	ENABLE_VOLUME_FROM_GAIN: false, // TODO: enable that with a significative delay between calls because of Deezer API Rate Limits (not done yet)

	SAMPLE_MAX_DURATION: 30000,

	STRATEGIES: {
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

}

export default Config
