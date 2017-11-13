import axios from 'axios'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.spotify.com/v1/'

const Fetcher = axios.create({
    baseURL: API_BASE_URL
})

// https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
// curl -X POST https://accounts.spotify.com/api/token -d grant_type=client_credentials --header "Authorization: Basic YmUxNTZlMWUxMGRlNDNiMmI0ZTNmNzNiMmY0MGQxZGM6ODMzOTJmMjkxYjBjNDYyMTk2OTgyYWY5NzUwMTQ0YTg="

const fetchAPI = url => new Promise((resolve, reject) => { // TODO
	Fetcher.post(API_BASE_URL + url, null, (err, data) => {
		if (err)
			reject(err)
		else if (data && data.error)
			reject(data.error)
		else
			resolve(data)
	})
})

const fetchAlbum = async albumId => fetchAPI(`albums/${albumId}`)

export const fetchSourceData = async (sourceType, sourceId) => {
	let sourceData
	switch (sourceType)
	{
		case 'album':
		{
			const albumData = await fetchAlbum(sourceId)
			sourceData = albumData.tracks.items.map(trackData => {
				// In that case we have to enrich each track data with the cover which is available in the album data
				trackData.cover = albumData.images[0].url
				return trackData
			})
			break
		}
		default:
		{
			throw new Error(`Unknown spotify source type "${sourceType}"`)
		}
	}
	return sourceData.map(trackData => ({
		cover: trackData.cover,
		id: trackData.id,
		playing: false,
		preview: trackData.preview_url,
		readable: true, // TODO
		title: trackData.name,
		url: trackData.external_urls.spotify,
		volume1: 0.5,
		volume2: 1.0
	}))
}

export const fetchTrack = async trackId => {
	const trackData = await fetchAPI(`tracks/${trackId}`)
	return {
		cover: trackData.album.images[0].url,
		id: trackData.id,
		playing: false,
		preview: trackData.preview_url,
		readable: true, // TODO
		title: trackData.name,
		url: trackData.external_urls.spotify,
		volume1: 0.5,
		volume2: 1.0
	}
}
