export interface Track {
	cover: string;
	id: string | number;
	preview: string;
	title: string;
	url: string;
	readable?: boolean;
	bpm?: number;
	gain?: number;
}

export type EnrichmentCallback = (baseIndex: number, enrichedTracks: Partial<Track>[]) => void;

export default class Provider {
	tracksCacheExpiration: number;

	constructor() {
		this.tracksCacheExpiration = 60 * 60 * 24 // seconds (1d) can be overriden per Provider
	}

	async enrichTracks(_tracks: Track[], _cb: EnrichmentCallback): Promise<void> {
		// To be overridden by subclasses
	}

	async fetchTracks(sourceType: string, _sourceId: string): Promise<Track[]> {
		switch (sourceType)
		{
			default:
			{
				throw new Error(`Unknown source type "${sourceType}"`)
			}
		}
	}
}
