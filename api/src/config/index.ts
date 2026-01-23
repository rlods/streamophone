export interface ApiConfig {
	PORT: number;
}

export interface CacheConfig {
	HOST: string | undefined;
	PORT: number;
	PASSWORD: string | undefined;
}

export interface FakeConfig {
	URL: string | undefined;
}

export interface StreamerConfig {
	URL: string | undefined;
}

export interface DeezerProviderConfig {
	// declared to activate Deezer support
}

export interface FreesoundProviderConfig {
	token: string | undefined;
}

export interface InaProviderConfig {
	// declared to activate INA support
}

export interface SpotifyProviderConfig {
	clientId: string | undefined;
	clientSecret: string | undefined;
}

export interface TestProviderConfig {
	// declared to activate Test data support
}

export interface ProvidersConfig {
	DEEZER: DeezerProviderConfig;
	FREESOUND: FreesoundProviderConfig;
	INA: InaProviderConfig;
	SPOTIFY: SpotifyProviderConfig;
	TEST: TestProviderConfig;
}

export interface Config {
	API: ApiConfig;
	CACHE: CacheConfig;
	FAKE: FakeConfig;
	STREAMER: StreamerConfig;
	PROVIDERS: ProvidersConfig;
	WHITELIST: (string | undefined)[];
}

const config: Config = {
	API: {
		PORT: parseInt(process.env.STREAMOPHONE_API_PORT || '3000', 10)
	},

	CACHE: {
		HOST: process.env.STREAMOPHONE_CACHE_HOST,
		PORT: parseInt(process.env.STREAMOPHONE_CACHE_PORT || '6379', 10),
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
