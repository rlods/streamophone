
const config = {
	STREAMER: {
		PORT: parseInt(process.env.STREAMOPHONE_STREAMER_PORT, 10)
	},
	
	WHITELIST: [
		process.env.STREAMOPHONE_WWW_URL
	]
}
export default config
