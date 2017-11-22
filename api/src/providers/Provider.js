
export default class Provider
{
	// constructor() {
	// }

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
