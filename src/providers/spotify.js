import axios from 'axios'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.spotify.com/v1/'

const CLIENT_ID = 'be156e1e10de43b2b4e3f73b2f40d1dc' // TODO: to remove of course
const CLIENT_SECRET = '83392f291b0c462196982af9750144a8' // TODO: to remove of course
const AUTHORIZATION1 = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
const AUTHORIZATION2 = null

// https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
// curl -X POST https://accounts.spotify.com/api/token -d grant_type=client_credentials --header "Authorization: Basic YmUxNTZlMWUxMGRlNDNiMmI0ZTNmNzNiMmY0MGQxZGM6ODMzOTJmMjkxYjBjNDYyMTk2OTgyYWY5NzUwMTQ0YTg="
// Test Album ID: 5rOHrnrRomvSJhQLGVtfJ8

const Fetcher = axios.create({
	baseURL: API_BASE_URL
})

const refreshAuthentication() { // TODO: process AUTHORIZATION2
	axios({ // Cannot be executed on client side because spotify restricted the call to server only
		method: 'post',
		url: 'https://accounts.spotify.com/api/token',
		headers: {
			Authorization: `Authorization: Basic ${AUTHORIZATION1}`
		}
	}).then(x => {
		console.log(x)
	})
}

const fetchAPI = async url => {
	console.log(API_BASE_URL + url)
	let execute = true
	while (execute) {
		try {
			execute = false
			const response = await Fetcher.get(API_BASE_URL + url, {
				Authorization: `Bearer ${AUTHORIZATION2}`
			})
			return response.data
		}
		catch (error) {
			if (error.response) {
				if (error.response.status === 403) {
					await refreshAuthentication()
					execute = true // Refresh succeeded, we'll retry the API call
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
