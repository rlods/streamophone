interface StreamerConfig {
	PORT: number;
}

interface Config {
	STREAMER: StreamerConfig;
	WHITELIST: (string | undefined)[];
}

const config: Config = {
	STREAMER: {
		PORT: parseInt(process.env.STREAMOPHONE_STREAMER_PORT || '3000', 10)
	},

	WHITELIST: [
		process.env.STREAMOPHONE_WWW_URL
	]
};

export default config;
