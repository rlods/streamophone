import axios from 'axios'
//
import config from '../config'
import Provider from './Provider'

// ------------------------------------------------------------------

// https://freesound.org/apiv2/packs/16873/sounds?format=json
// https://freesound.org/apiv2/sounds/395246?format=json

const API_BASE_URL = 'https://freesound.org/apiv2/'
const API_FETCHER = axios.create({ baseURL: API_BASE_URL })

// ------------------------------------------------------------------

export default class FreesoundProvider extends Provider
{
	//constructor() {
	//	super()
	//}

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
				tracks = (await this.fetchPackSounds(sourceId)).results.map(track => {
					const preview = track.previews ? track.previews['preview-lq-mp3'] : null
					return {
						cover: track.images.waveform_m,
						id: track.id,
						preview,
						readable: !!preview && preview.endsWith('.mp3'),
						title: track.name,
						url: track.url
					}
				})
				break
			default:
				throw new Error(`Unknown freesound source type "${sourceType}"`)
		}
		return await Promise.all(tracks)
	}

	async fetchPackSounds(packId) {
		return this.fetchAPI(`packs/${packId}/sounds?fields=id,name,images,previews,url`)
	}
}
