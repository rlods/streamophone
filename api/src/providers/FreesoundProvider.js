import axios from 'axios'
//
import config from '../config'
import Provider from './Provider'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://freesound.org/apiv2/'
const API_FETCHER = axios.create({ baseURL: API_BASE_URL })

// ------------------------------------------------------------------

export default class FreesoundProvider extends Provider
{
	async fetchAPI(url) {
		const response = await API_FETCHER.get(`${url}&format=json&token=${config.TMP.FREESOUND}`)
		const { data } = response
		if (data && data.error)
			throw new Error(data.error)
		return data
	}

	async fetchTracks(sourceType, sourceId) {
		let tracks
		switch (sourceType)
		{
			case 'pack':
				tracks = await this.fetchTracksFromPack(sourceId)
				break
			case 'search':
				tracks = await this.fetchTracksFromSearch(sourceId)
				break
			default:
				throw new Error(`Unknown Freesound source type "${sourceType}"`)
		}
		return tracks.filter(track => !!track.preview && track.preview.endsWith('.mp3'))
	}

	async fetchTracksFromPack(packId) {
		const pack = await this.fetchAPI(`packs/${packId}/sounds?fields=id,name,images,previews,url`)
		return pack.results.map(track => {
			const preview = track.previews ? track.previews['preview-lq-mp3'] : null
			return {
				cover: track.images.waveform_m,
				id: track.id,
				preview,
				title: track.name,
				url: track.url
			}
		})
	}

	async fetchTracksFromSearch(query) {
		const search = await this.fetchAPI(`search/text/?query=${query}&fields=id,name,images,previews,url`)
		return search.results.map(track => {
			const preview = track.previews ? track.previews['preview-lq-mp3'] : null
			return {
				cover: track.images.waveform_m,
				id: track.id,
				preview,
				title: track.name,
				url: track.url
			}
		})
	}
}
