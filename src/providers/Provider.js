
export default class Provider
{
	// constructor() {
	// }

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
