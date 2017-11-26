
const Config = {

	API: {
		URL: process.env.REACT_APP_STREAMOPHONE_API_URL,
	},

	WWW: {
		URL: process.env.REACT_APP_STREAMOPHONE_WWW_URL,
	},

	CURATED_SOURCES: [
		{ sourceType: 'deezer_playlist', sourceId: '1083902971',             title: 'Hits 2017' },
		{ sourceType: 'deezer_playlist', sourceId: '791313621',              title: 'The Greatest Piano Classics' },
		{ sourceType: 'deezer_playlist', sourceId: '548368765',              title: 'Long Playlist' },
		{ sourceType: 'deezer_playlist', sourceId: '3789105302',             title: 'Steve Reich' },
		{ sourceType: 'deezer_playlist', sourceId: '10178447',               title: 'Percus' },
		{ sourceType: 'deezer_playlist', sourceId: '3791846562',             title: 'Speeches' },
		{ sourceType: 'deezer_playlist', sourceId: '1194890603',             title: 'Best of Daft Punk' },
		{ sourceType: 'deezer_playlist', sourceId: '771276181',              title: 'Musique concrète et électronique' },
		{ sourceType: 'deezer_playlist', sourceId: '3510240466',             title: 'Soul to Funk' },
		{ sourceType: 'deezer_playlist', sourceId: '23804156',               title: 'Minimal electro house' },
		{ sourceType: 'deezer_playlist', sourceId: '2762818384',             title: 'Musique concrète' },
		{ sourceType: 'deezer_album',    sourceId: '13686698',               title: 'Mr. Robot, Vol. 1' },
		{ sourceType: 'deezer_artist',   sourceId: '27',                     title: 'Daft Punk' },
		{ sourceType: 'freesound_pack',  sourceId: '7447',                   title: 'Zeeland dunes' },
		{ sourceType: 'freesound_pack',  sourceId: '16873',                  title: 'Industrial' },
		{ sourceType: 'spotify_album',   sourceId: '0QhwxYDUougJiVDtyN4Lhm', title: 'SPT1' },
		{ sourceType: 'spotify_artist',  sourceId: '0OdUWJ0sBjDrqHygGUXeCF', title: 'SPT2' }
	],

	DEFAULT: {
		SAMPLER_DURATION: -1, // do not shortened
		SAMPLER_STRATEGY: 'KEYBOARD_AZERTY',
		SOURCE_BPM: -1, // do not adjust BPM
		SOURCE_ID: '791313621',
		SOURCE_TRANSFORMATION: 'shuffle',
		SOURCE_TYPE: 'deezer_playlist'
	},

	ENABLE_LOGGER: false, // process.env.NODE_ENV !== 'production'

	ENABLE_VOLUME_FROM_GAIN: false, // TODO: enable that with a significative delay between calls because of Deezer API Rate Limits (not done yet)

	DRIVERS: {
		d1: {
			type: 'basic'
		},
		d2: {
			type: 'midi'
		},
		// d3: {
		//	type: 'socket',
		//	socketUrl: 'http://129.102.147.114:3000',
		//	socketPrefix: 'main'
		// }
	},

	STRATEGIES: {
		KEYBOARD_AZERTY: {
			driver: 'd1',
			label: 'Keyboard Azerty'
		},
		KEYBOARD_QWERTY: {
			driver: 'd1',
			label: 'Keyboard Qwerty'
		},
		BCF2000_BUTTONS: {
			driver: 'd2',
			label: 'BCF2000 - Buttons'
		},
		BCF2000_SINGLESLIDER: {
			driver: 'd2',
			label: 'BCF2000 - Single Slider'
		},
		BCF2000_MULTISLIDERS: {
			driver: 'd2',
			label: 'BCF2000 - Multi Sliders'
		},
		LIGHTPADBLOCK_4: {
			driver: 'd2',
			label: 'ROLI LightPadBlock 2x2'
		},
		LIGHTPADBLOCK_16: {
			driver: 'd2',
			label: 'ROLI LightPadBlock 4x4'
		},
		KEYBOARD_24: {
			driver: 'd2',
			label: 'OXYGEN25'
		},
		KORG_NANOKEY2: {
			driver: 'd2',
			label: 'KORG NanoKey2'
		},
		// CUSTOM_SOCKET: {
		//	driver: 'd3',
		//	label: 'CUSTOM_SOCKET (25 samples)'
		//}
	},

	SOURCE_TYPES: {
		deezer_album: 'Deezer Album',
		deezer_artist: 'Deezer Artist',
		deezer_playlist: 'Deezer Playlist',
		deezer_search: 'Deezer Search',
		freesound_pack: 'Freesound Pack',
		freesound_search: 'Freesound Search',
		spotify_album: 'Spotify Album',
		spotify_artist: 'Spotify Artist',
		test_test: 'Test',
		ina_search: 'INA Search'
	}
}

export default Config
