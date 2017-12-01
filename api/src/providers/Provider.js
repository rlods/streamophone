
export default class Provider
{
	constructor() {
		this.tracksCacheExpiration = 60*60*24 // seconds (1d) can be overriden per Provider
	}

	async enrichTracks(tracks, cb) {
	}

	async fetchTracks(sourceType, sourceId) {
		switch (sourceType)
		{
			default:
			{
				throw new Error(`Unknown source type "${sourceType}"`)
			}
		}
	}
}
