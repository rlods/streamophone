
const Config = {

	CURATED_SOURCES: [
		{ sourceType: 'playlist', sourceId: 1083902971, title: 'Hits 2017' },
		{ sourceType: 'playlist', sourceId: 791313621,  title: 'The Greatest Piano Classics' },
		{ sourceType: 'playlist', sourceId: 548368765,  title: 'Long Playlist' },
		{ sourceType: 'playlist', sourceId: 3789105302, title: 'Steve Reich' },
		{ sourceType: 'playlist', sourceId: 10178447,   title: 'Percus' },
		{ sourceType: 'playlist', sourceId: 3791846562, title: 'Speeches' },
		{ sourceType: 'playlist', sourceId: 1194890603, title: 'Best of Daft Punk' },
		{ sourceType: 'playlist', sourceId: 771276181,  title: 'Musique concrète et électronique' },
		{ sourceType: 'playlist', sourceId: 3510240466, title: 'Soul to Funk' },
		{ sourceType: 'playlist', sourceId: 23804156,   title: 'Minimal electro house' },
		{ sourceType: 'album',    sourceId: 43825781,   title: 'Jul - Je ne me vois pas briller' },
		{ sourceType: 'artist',   sourceId: 27,         title: 'Daft Punk' }
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
		KORG_NANOKEY2: {
			driver: 'midi',
			label: 'KORG NanoKey2'
		},
		// CUSTOM_SOCKET: {
		//	driver: 'socket',
		//	label: 'CUSTOM_SOCKET (25 samples)'
		//}
	}

}

export default Config
