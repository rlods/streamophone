import axios from 'axios'
//
import config from '../config'
import Provider from './Provider'

// ------------------------------------------------------------------

const API_BASE_URL = 'http://fresques.ina.fr/jalons/api/'
const API_FETCHER = axios.create({ baseURL: API_BASE_URL })

// ------------------------------------------------------------------

const extractVideo = async url => {
	const { data } = await axios.get(url)
	const x = data.match(/window\[[^\]]*\]\ =\ ([^;]*)/m)[1]
	const assets = JSON.parse(x).components['component.player.video'].api.document.mediaAssets
	const lastKey = Object.keys(assets).slice(-1)[0]
	return assets[lastKey][0].url.replace('http://fresques.ina.fr/jalons/media/video/lire/', `${config.API.URL}/stream/ina/`)
}

export default class InaProvider extends Provider
{
	constructor() {
		super()
	}

	async fetchAPI(url) {
		const response = await API_FETCHER.get(url)
		const { data } = response
		if (data && data.error)
			throw new Error(data.error)
		return data
	}

	async fetchTracks(sourceType, sourceId) {
		let tracks
		switch (sourceType)
		{
			case 'search':
				tracks = await this.fetchTracksFromSearch(sourceId)
				break
			default:
				throw new Error(`Unknown INA source type "${sourceType}"`)
		}
		return await Promise.all(tracks.map(async resource => ({
			cover: 'http://fresques.ina.fr/jalons/media/imagette/512x384/' + resource.id,
			id: resource.id,
			preview: await extractVideo(resource.html.match(/src="([^"]*)/)[1]),
			title: resource.title,
			url: resource.url
		})))
	}

	async fetchTracksFromSearch(query) {
		const search = await this.fetchAPI(`search?query=${query}`)
		return search.return.resources
	}
}
