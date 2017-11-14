import jsonp from 'jsonp'
//
import config from '../config'

// ------------------------------------------------------------------

// https://freesound.org/apiv2/packs/16873/sounds?format=json
// https://freesound.org/apiv2/sounds/395246?format=json

const API_BASE_URL = 'https://freesound.org/apiv2/'

// ------------------------------------------------------------------

export default class FreesoundProvider
{
	// constructor() {
	// }

	fetchAPI(url) {
		return new Promise((resolve, reject) => {
			jsonp(API_BASE_URL + url + `?format=jsonp&token=${config.TMP.FREESOUND}`, null, (err, data) => {
				if (err)
					reject(err)
				else if (data && data.error)
					reject(data.error)
				else
					resolve(data)
			})
		})
	}

	async fetchTracks(sourceType, sourceId) {
		let tracks
		switch (sourceType)
		{
			case 'freesound_pack':
				tracks = (await this.fetchPackSounds(sourceId)).results.map(trackData => this.fetchTrack(trackData.id))
				break
			default:
				throw new Error(`Unknown freesound source type "${sourceType}"`)
		}
		return await Promise.all(tracks)
	}

	async fetchPackSounds(packId) {
		return this.fetchAPI(`packs/${packId}/sounds`)
	}

	async fetchTrack(trackId) {
		const track = await this.fetchAPI(`sounds/${trackId}`)
		const preview = track.previews ? track.previews['preview-lq-mp3'] : null
		return {
			// cover: ... no cover available,
			id: track.id,
			playing: false,
			preview,
			readable: !!preview,
			title: track.name,
			url: track.url,
			volume1: 0.5,
			volume2: 1.0
		}
	}
}
