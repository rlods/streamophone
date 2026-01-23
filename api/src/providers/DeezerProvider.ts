import axios, { type AxiosInstance } from 'axios'
import Provider, { type Track, type EnrichmentCallback } from './Provider'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.deezer.com/'
const API_FETCHER: AxiosInstance = axios.create({ baseURL: API_BASE_URL })
const ENRICHMENT_CHUNK = 10
const ENRICHMENT_DELAY = 500

// ------------------------------------------------------------------

interface DeezerTrackData {
	id: number;
	title: string;
	preview: string;
	link: string;
	readable: boolean;
	bpm?: number;
	gain?: number;
	album: {
		cover_medium: string;
	};
}

interface DeezerAlbumResponse {
	cover_medium: string;
	tracks: {
		data: DeezerTrackData[];
	};
}

interface DeezerArtistRadioResponse {
	data: DeezerTrackData[];
}

interface DeezerPlaylistResponse {
	tracks: {
		data: DeezerTrackData[];
	};
}

interface DeezerSearchResponse {
	data: DeezerTrackData[];
}

interface DeezerTrackDetailResponse {
	id: number;
	bpm: number;
	gain: number;
}

// ------------------------------------------------------------------

class EnrichmentProcessor {
	baseIndex: number;
	cb: EnrichmentCallback | null;
	provider: DeezerProvider;
	tracks: DeezerTrackData[] | null;
	interval: ReturnType<typeof setInterval> | null;

	constructor(provider: DeezerProvider) {
		this.baseIndex = 0
		this.cb = null
		this.provider = provider
		this.tracks = null
		this.interval = null
	}

	register(tracks: DeezerTrackData[], cb: EnrichmentCallback): void {
		if (this.interval) {
			clearInterval(this.interval)
			this.baseIndex = 0
			this.cb = null
			this.interval = null
			this.tracks = null
		}
		if (cb && tracks && tracks.length > 0) {
			this.cb = cb
			this.tracks = tracks.slice() // we have to copy the given tracks because we'll modify it in process
			this.interval = setInterval(this.process.bind(this), ENRICHMENT_DELAY)
		}
	}

	async process(): Promise<void> {
		const tracks = this.tracks!.splice(0, ENRICHMENT_CHUNK)
		if (tracks.length > 0) {
			const enrichedTracks = await Promise.all(tracks.map(async (track) => {
				const { id, bpm, gain } = await this.provider.fetchAPI<DeezerTrackDetailResponse>(`track/${track.id}`)
				return {
					id,
					bpm,
					gain
				}
			}))
			this.cb!(this.baseIndex, enrichedTracks)
			this.baseIndex += ENRICHMENT_CHUNK
		}
	}
}

// ------------------------------------------------------------------

export default class DeezerProvider extends Provider {
	private enricher: EnrichmentProcessor;

	constructor() {
		super()
		this.enricher = new EnrichmentProcessor(this)
	}

	async fetchAPI<T>(url: string): Promise<T> {
		console.log('Fetching Deezer', url)
		const response = await API_FETCHER.get<T & { error?: string }>(url)
		const { data } = response
		if (data && data.error)
			throw new Error(data.error)
		return data
	}

	enrichTracks(tracks: Track[], cb: EnrichmentCallback): void {
		this.enricher.register(tracks as unknown as DeezerTrackData[], cb)
	}

	async fetchTracks(sourceType: string, sourceId: string): Promise<Track[]> {
		let tracks: DeezerTrackData[]
		switch (sourceType)
		{
			case 'ALBUM':
				tracks = await this.fetchTracksFromAlbum(sourceId)
				break
			case 'ARTIST':
				tracks = await this.fetchTracksFromArtist(sourceId)
				break
			case 'PLAYLIST':
				tracks = await this.fetchTracksFromPlaylist(sourceId)
				break
			case 'SEARCH':
				tracks = await this.fetchTracksFromSearch(sourceId)
				break
			default:
				throw new Error(`Unknown Deezer source type "${sourceType}"`)
		}
		return tracks
			.filter(track => !!track.preview && track.readable)
			.map(track => ({
				cover: track.album.cover_medium,
				id: track.id,
				preview: track.preview,
				title: track.title,
				url: track.link
			}))
	}

	private async fetchTracksFromAlbum(albumId: string): Promise<DeezerTrackData[]> {
		const album = await this.fetchAPI<DeezerAlbumResponse>(`album/${albumId}`)
		return album.tracks.data.map(track => {
			// In that case we have to enrich each track data with the cover which is available in the album data
			track.album = { cover_medium: album.cover_medium }
			return track
		})
	}

	private async fetchTracksFromArtist(artistId: string): Promise<DeezerTrackData[]> {
		const artist = await this.fetchAPI<DeezerArtistRadioResponse>(`artist/${artistId}/radio`)
		return artist.data.map(track => {
			// In that case we have to enrich each track data with the cover which is available in the album data
			track.link = 'https://www.deezer.com/track/' + track.id
			return track
		})
	}

	private async fetchTracksFromPlaylist(playlistId: string): Promise<DeezerTrackData[]> {
		const playlist = await this.fetchAPI<DeezerPlaylistResponse>(`playlist/${playlistId}`)
		return playlist.tracks.data
	}

	private async fetchTracksFromSearch(query: string): Promise<DeezerTrackData[]> {
		const search = await this.fetchAPI<DeezerSearchResponse>(`search/track?q=${encodeURI(query)}`)
		return search.data
	}
}
