
const Config = {

	API: {
		URL: process.env.REACT_APP_STREAMOPHONE_API_URL,
	},

	WWW: {
		URL: process.env.REACT_APP_STREAMOPHONE_WWW_URL,
	},

	CURATED_SOURCES: [
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '1083902971',             title: 'Hits 2017' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '791313621',              title: 'The Greatest Piano Classics' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '548368765',              title: 'Long Playlist' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '3789105302',             title: 'Steve Reich' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '10178447',               title: 'Percus' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '3791846562',             title: 'Speeches' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '1194890603',             title: 'Best of Daft Punk' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '771276181',              title: 'Musique concrète et électronique' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '3510240466',             title: 'Soul to Funk' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '23804156',               title: 'Minimal electro house' },
		{ sourceType: 'DEEZER_PLAYLIST', sourceId: '2762818384',             title: 'Musique concrète' },
		{ sourceType: 'DEEZER_ALBUM',    sourceId: '13686698',               title: 'Mr. Robot, Vol. 1' },
		{ sourceType: 'DEEZER_ALBUM',    sourceId: '12541456',               title: 'BNF Collection, Ella and Louis, The Anthology' },
		{ sourceType: 'DEEZER_ARTIST',   sourceId: '27',                     title: 'Daft Punk' },
		{ sourceType: 'FREESOUND_PACK',  sourceId: '7447',                   title: 'Zeeland dunes' },
		{ sourceType: 'FREESOUND_PACK',  sourceId: '16873',                  title: 'Industrial' },
		{ sourceType: 'INA_SEARCH',      sourceId: 'guerre',                 title: 'World War Old Documentaries' },
		{ sourceType: 'SPOTIFY_ALBUM',   sourceId: '0QhwxYDUougJiVDtyN4Lhm', title: 'SPT1' },
		{ sourceType: 'SPOTIFY_ARTIST',  sourceId: '0OdUWJ0sBjDrqHygGUXeCF', title: 'SPT2' }
	],

	DEFAULT: {
		SAMPLER_DURATION: -1, // default: not shortened
		SAMPLER_STRATEGY: 'KEYBOARD_AZERTY',
		SOURCE_BPM: -1, // default: not adjusted
		SOURCE_ID: '791313621',
		SOURCE_TRANSFORMATION: 'shuffle',
		SOURCE_TYPE: 'DEEZER_PLAYLIST'
	},

	ENABLE_LOGGER: false, // process.env.NODE_ENV !== 'production'

	DRIVERS: {
		DRIVER1: {
			type: 'basic'
		},
		DRIVER2: {
			type: 'midi'
		},
		// DRIVER3: {
		//	type: 'socket',
		//	socketUrl: 'http://129.102.147.114:3000',
		//	socketPrefix: 'main'
		// }
	},

	STRATEGIES: {
		KEYBOARD_AZERTY: {
			driver: 'DRIVER1',
			label: 'Keyboard Azerty'
		},
		KEYBOARD_QWERTY: {
			driver: 'DRIVER1',
			label: 'Keyboard Qwerty'
		},
		BCF2000_BUTTONS: {
			driver: 'DRIVER2',
			label: 'BCF2000 - Buttons'
		},
		BCF2000_SINGLESLIDER: {
			driver: 'DRIVER2',
			label: 'BCF2000 - Single Slider'
		},
		BCF2000_MULTISLIDERS: {
			driver: 'DRIVER2',
			label: 'BCF2000 - Multi Sliders'
		},
		LIGHTPADBLOCK_4: {
			driver: 'DRIVER2',
			label: 'ROLI LightPadBlock 2x2'
		},
		LIGHTPADBLOCK_16: {
			driver: 'DRIVER2',
			label: 'ROLI LightPadBlock 4x4'
		},
		KEYBOARD_24: {
			driver: 'DRIVER2',
			label: 'OXYGEN25'
		},
		KORG_NANOKEY2: {
			driver: 'DRIVER2',
			label: 'KORG NanoKey2'
		},
		// CUSTOM_SOCKET: {
		//	driver: 'DRIVER3',
		//	label: 'CUSTOM_SOCKET'
		//}
	},

	SOURCE_TYPES: {
		DEEZER_ALBUM: {
			label: 'Deezer Album',
			input_label : 'Album ID'
		},
		DEEZER_ARTIST: {
			label: 'Deezer Artist',
			input_label : 'Artist ID'
		},
		DEEZER_PLAYLIST: {
			label: 'Deezer Playlist',
			input_label : 'Playlist ID'
		},
		DEEZER_SEARCH: {
			label: 'Deezer Search',
			input_label : 'Query'
		},
		FREESOUND_PACK: {
			label: 'Freesound Pack',
			input_label : 'Pack ID'
		},
		FREESOUND_SEARCH: {
			label: 'Freesound Search',
			input_label : 'Query'
		},
		INA_SEARCH: {
			label: 'INA Search',
			input_label : 'Query'
		},
		SPOTIFY_ALBUM: {
			label: 'Spotify Album',
			input_label : 'Album ID'
		},
		SPOTIFY_ARTIST: {
			label: 'Spotify Artist',
			input_label : 'Artist ID'
		},
		SPOTIFY_SEARCH: {
			label: 'Spotify Search',
			input_label : 'Query'
		},
		...(process.env.NODE_ENV !== 'production' ? { 
			TEST_TEST: {
				label: 'Test',
				input_label: '...'
			}
		} : {})
	}
}

export default Config
