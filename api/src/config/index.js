
const config = {
	API: {
		PORT: parseInt(process.env.STREAMOPHONE_API_PORT, 10)
	},

	CACHE: {
		HOST: process.env.STREAMOPHONE_CACHE_HOST,
		PORT: parseInt(process.env.STREAMOPHONE_CACHE_PORT, 10),
		PASSWORD: process.env.STREAMOPHONE_CACHE_PASSWORD
	},

	FAKE: {
		URL: process.env.STREAMOPHONE_TEST_ASSETS_URL
	},

	STREAMER: {
		URL: process.env.STREAMOPHONE_STREAMER_URL
	},

	PROVIDERS: {
		DEEZER: { // declared to activate Deezer support
		},
		FREESOUND: {
			token: process.env.STREAMOPHONE_FREESOUND_TOKEN
		},
		INA: { // declared to activate INA support
		},
		SPOTIFY: {
			clientId: process.env.STREAMOPHONE_SPOTIFY_CLIENT_ID,
			clientSecret: process.env.STREAMOPHONE_SPOTIFY_CLIENT_SECRET
		},
		TEST: { // declared to activate Test data support
		}
	},

	WHITELIST: [
		process.env.STREAMOPHONE_WWW_URL
	]
}
export default config
