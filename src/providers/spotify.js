import axios from 'axios'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.spotify.com/v1/'

const CLIENT_ID = 'be156e1e10de43b2b4e3f73b2f40d1dc' // TODO: to remove of course
let AUTHORIZATION_CODE = sessionStorage.getItem('SPOTIFY_AT')

// https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
// curl -X POST https://accounts.spotify.com/api/token -d grant_type=client_credentials --header "Authorization: Basic YmUxNTZlMWUxMGRlNDNiMmI0ZTNmNzNiMmY0MGQxZGM6ODMzOTJmMjkxYjBjNDYyMTk2OTgyYWY5NzUwMTQ0YTg="
// Test Album ID: 5rOHrnrRomvSJhQLGVtfJ8

if (!AUTHORIZATION_CODE && document.location.hash) {
	const hashParams = document.location.hash.slice(1)

	function getParameterByName(name) {
		name = name.replace(/[[]]/g, "\\$&")
		const regex = new RegExp(name + "(=([^&#]*)|&|#|$)")
		const results = regex.exec(hashParams)
		if (!results) return null
		if (!results[2]) return ''
		return decodeURIComponent(results[2].replace(/\+/g, " "))
	}

	if ('spotify' === getParameterByName('state')) {
		AUTHORIZATION_CODE = getParameterByName('access_token')
		sessionStorage.setItem('SPOTIFY_AT', AUTHORIZATION_CODE)
	}
}

const Fetcher = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		Authorization: `Bearer ${AUTHORIZATION_CODE}`
	}
})

const refreshAuthentication = () => document.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&state=spotify&redirect_uri=http://localhost:8080`

const fetchAPI = async url => {
	console.log(API_BASE_URL + url, `Bearer ${AUTHORIZATION_CODE}`)
	try {
		const response = await Fetcher.get(API_BASE_URL + url)
		return response.data
	}
	catch (error) {
		if (error.response) {
			if (error.response.status === 401) {
				refreshAuthentication()
			}
			else {
				throw new Error(error.response.data.message)
			}
		}
		else {
			throw error
		}
	}
}

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
