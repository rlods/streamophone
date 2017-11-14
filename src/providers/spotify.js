import axios from 'axios'
//
import config from '../config'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.spotify.com/v1/'

const CLIENT_ID = config.TMP.SPOTIFY
let AUTHORIZATION_CODE = sessionStorage.getItem('SPOTIFY_AT')

// https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
// curl -X POST https://accounts.spotify.com/api/token -d grant_type=client_credentials --header "Authorization: Basic YmUxNTZlMWUxMGRlNDNiMmI0ZTNmNzNiMmY0MGQxZGM6ODMzOTJmMjkxYjBjNDYyMTk2OTgyYWY5NzUwMTQ0YTg="
// Test Album ID: 5rOHrnrRomvSJhQLGVtfJ8

if (!AUTHORIZATION_CODE && document.location.hash) {
	const params = document.location.hash.slice(1)

	function getParameterByName(name) {
		name = name.replace(/[[]]/g, "\\$&")
		const regex = new RegExp(name + "(=([^&#]*)|&|#|$)")
		const results = regex.exec(params)
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

export const fetchTracks = async (sourceType, sourceId) => {
	let tracks
	switch (sourceType)
	{
		case 'album':
		{
			const albumData = await fetchAlbum(sourceId)
			tracks = albumData.tracks.items.map(track => {
				// In that case we have to enrich each track data with the cover which is available in the album data
				track.cover = albumData.images[0].url
				return track
			})
			break
		}
		default:
		{
			throw new Error(`Unknown spotify source type "${sourceType}"`)
		}
	}
	return tracks.map(track => ({
		cover: track.cover,
		id: track.id,
		playing: false,
		preview: track.preview_url,
		readable: true, // TODO
		title: track.name,
		url: track.external_urls.spotify,
		volume1: 0.5,
		volume2: 1.0
	}))
}

export const fetchTrack = async trackId => {
	const track = await fetchAPI(`tracks/${trackId}`)
	return {
		cover: track.album.images[0].url,
		id: track.id,
		playing: false,
		preview: track.preview_url,
		readable: true, // TODO
		title: track.name,
		url: track.external_urls.spotify,
		volume1: 0.5,
		volume2: 1.0
	}
}
