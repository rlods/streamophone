
const Config = {

	CURATED_SOURCES: [
		{ sourceType: 'deezer_playlist', sourceId: 1083902971,               title: 'Hits 2017' },
		{ sourceType: 'deezer_playlist', sourceId: 791313621,                title: 'The Greatest Piano Classics' },
		{ sourceType: 'deezer_playlist', sourceId: 548368765,                title: 'Long Playlist' },
		{ sourceType: 'deezer_playlist', sourceId: 3789105302,               title: 'Steve Reich' },
		{ sourceType: 'deezer_playlist', sourceId: 10178447,                 title: 'Percus' },
		{ sourceType: 'deezer_playlist', sourceId: 3791846562,               title: 'Speeches' },
		{ sourceType: 'deezer_playlist', sourceId: 1194890603,               title: 'Best of Daft Punk' },
		{ sourceType: 'deezer_playlist', sourceId: 771276181,                title: 'Musique concrète et électronique' },
		{ sourceType: 'deezer_playlist', sourceId: 3510240466,               title: 'Soul to Funk' },
		{ sourceType: 'deezer_playlist', sourceId: 23804156,                 title: 'Minimal electro house' },
		{ sourceType: 'deezer_playlist', sourceId: 2762818384,               title: 'Musique concrète' },
		{ sourceType: 'deezer_album',    sourceId: 13686698,                 title: 'Mr. Robot, Vol. 1' },
		{ sourceType: 'deezer_artist',   sourceId: 27,                       title: 'Daft Punk' },
		{ sourceType: 'freesound_pack',  sourceId: 7447,                     title: 'Zeeland dunes' },
		{ sourceType: 'freesound_pack',  sourceId: 16873,                    title: 'Industrial' },
		{ sourceType: 'spotify_album',   sourceId: '0QhwxYDUougJiVDtyN4Lhm', title: 'SPT1' },
		{ sourceType: 'spotify_artist',  sourceId: '0OdUWJ0sBjDrqHygGUXeCF', title: 'SPT2' }
	],

	DEFAULT: {
		SAMPLING_DURATION: -1, // do not shortened
		SAMPLING_STRATEGY: 'KEYBOARD_AZERTY',
		SOURCE_BPM: -1, // do not adjust BPM
		SOURCE_ID: '1083902971',
		SOURCE_TRANSFORMATION: 'shuffle',
		SOURCE_TYPE: 'deezer_playlist'
	},

	ENABLE_LOGGER: false, // process.env.NODE_ENV !== 'production'

	ENABLE_VOLUME_FROM_GAIN: false, // TODO: enable that with a significative delay between calls because of Deezer API Rate Limits (not done yet)

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
		KEYBOARD_QWERTY: {
			driver: 'basic',
			label: 'Keyboard Qwerty'
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
		LIGHTPADBLOCK_4: {
			driver: 'midi',
			label: 'ROLI LightPadBlock 2x2',
			midiName: 'Lightpad BLOCK' // TODO: this is the name given by the device, use it to match with the strategy
		},
		LIGHTPADBLOCK_16: {
			driver: 'midi',
			label: 'ROLI LightPadBlock 4x4',
			midiName: 'Lightpad BLOCK' // TODO: this is the name given by the device, use it to match with the strategy
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
	},

	TMP: {
		FREESOUND: 'aGhZQh3Ishqc7OvoqC7pWupWHsjalJuxIzURKVqt', // TODO: replace by oauth
		SPOTIFY: 'be156e1e10de43b2b4e3f73b2f40d1dc' // clientId for oauth
	}
}

export default Config
