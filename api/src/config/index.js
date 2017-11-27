
const config = {
	API: {
		PORT: process.env.STREAMOPHONE_API_PORT ? parseInt(process.env.STREAMOPHONE_API_PORT, 10) : 4242
	},

	WWW: {
		URL: process.env.STREAMOPHONE_WWW_URL
	},

	/*
	CACHE: {
		HOST: process.env.STREAMOPHONE_CACHE_HOST || 'localhost',
		PORT: parseInt(process.env.STREAMOPHONE_CACHE_PORT, 10) || 6379,
		PASSWORD: process.env.STREAMOPHONE_CACHE_PASSWORD || 'example'
	},
	*/

	FAKE: {
		URL: process.env.STREAMOPHONE_TEST_ASSETS_URL
	},

	STREAMER: {
		URL: process.env.STREAMOPHONE_STREAMER_URL
	},

	TMP: {
		FREESOUND: process.env.STREAMOPHONE_FREESOUND_TOKEN,
		SPOTIFY: process.env.STREAMOPHONE_SPOTIFY_CLIENT_ID,
		SPOTIFY_SECRET: process.env.STREAMOPHONE_SPOTIFY_CLIENT_SECRET
	}
}
export default config
