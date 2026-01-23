import axios, { type AxiosInstance } from 'axios'
import Provider, { type Track } from './Provider'
import type { FreesoundProviderConfig } from '../config'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://freesound.org/apiv2/'
const API_FETCHER: AxiosInstance = axios.create({ baseURL: API_BASE_URL })

// ------------------------------------------------------------------

interface FreesoundPreviews {
	'preview-lq-mp3'?: string;
	'preview-hq-mp3'?: string;
}

interface FreesoundImages {
	waveform_m: string;
}

interface FreesoundTrackData {
	id: number;
	name: string;
	url: string;
	images: FreesoundImages;
	previews?: FreesoundPreviews;
}

interface FreesoundPackResponse {
	results: FreesoundTrackData[];
}

interface FreesoundSearchResponse {
	results: FreesoundTrackData[];
}

// ------------------------------------------------------------------

export default class FreesoundProvider extends Provider {
	private token: string | undefined;

	constructor({ token }: FreesoundProviderConfig) {
		super()
		this.token = token
	}

	private async fetchAPI<T>(url: string): Promise<T> {
		console.log('Fetching Freesound', url)
		const response = await API_FETCHER.get<T & { error?: string }>(`${url}&format=json&token=${this.token}`)
		const { data } = response
		if (data && data.error)
			throw new Error(data.error)
		return data
	}

	async fetchTracks(sourceType: string, sourceId: string): Promise<Track[]> {
		let tracks: Track[]
		switch (sourceType)
		{
			case 'PACK':
				tracks = await this.fetchTracksFromPack(sourceId)
				break
			case 'SEARCH':
				tracks = await this.fetchTracksFromSearch(sourceId)
				break
			default:
				throw new Error(`Unknown Freesound source type "${sourceType}"`)
		}
		return tracks.filter(track => !!track.preview && track.preview.endsWith('.mp3'))
	}

	private async fetchTracksFromPack(packId: string): Promise<Track[]> {
		const pack = await this.fetchAPI<FreesoundPackResponse>(`packs/${packId}/sounds?fields=id,name,images,previews,url`)
		return pack.results.map(track => {
			const preview = track.previews ? track.previews['preview-lq-mp3'] : undefined
			return {
				cover: track.images.waveform_m,
				id: track.id,
				preview: preview || '',
				title: track.name,
				url: track.url
			}
		})
	}

	private async fetchTracksFromSearch(query: string): Promise<Track[]> {
		const search = await this.fetchAPI<FreesoundSearchResponse>(`search/text/?query=${encodeURI(query)}&fields=id,name,images,previews,url`)
		return search.results.map(track => {
			const preview = track.previews ? track.previews['preview-lq-mp3'] : undefined
			return {
				cover: track.images.waveform_m,
				id: track.id,
				preview: preview || '',
				title: track.name,
				url: track.url
			}
		})
	}
}
