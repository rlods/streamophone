
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

	DRIVERS: {
		basic: {
			type: 'basic'
		},
		midi: {
			type: 'midi'
		},
		// socket: {
		//	type: 'socket',
		//	socketUrl: 'http://129.102.147.114:3000',
		//	socketPrefix: 'main'
		// }
	},

	STRATEGIES: {
		KEYBOARD_AZERTY: {
			driver: 'basic',
			label: 'Keyboard Azerty'
		},
		BCF2000_BUTTONS: {
			driver: 'midi',
			label: 'BCF2000 - Buttons'
		},
		BCF2000_SINGLESLIDER: {
			driver: 'midi',
			label: 'BCF2000 - Single Slider'
		},
		BCF2000_MULTISLIDERS: {
			driver: 'midi',
			label: 'BCF2000 - Multi Sliders'
		},
		LIGHTPADBLOCK_16: {
			driver: 'midi',
			label: 'ROLI LightPadBlock'
		},
		KEYBOARD_24: {
			driver: 'midi',
			label: 'OXYGEN25'
		},
		// CUSTOM_SOCKET: {
		//	driver: 'socket',
		//	label: 'CUSTOM_SOCKET (25 samples)'
		//}
	}

}

export default Config
