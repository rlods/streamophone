import axios from 'axios'
//
import config from '../config'
import { getHashParam } from '../tools'
import Provider from './Provider'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.spotify.com/v1/'

// ------------------------------------------------------------------

// https://developer.spotify.com/my-applications/
// https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
// curl -X POST https://accounts.spotify.com/api/token -d grant_type=client_credentials --header "Authorization: Basic YmUxNTZlMWUxMGRlNDNiMmI0ZTNmNzNiMmY0MGQxZGM6ODMzOTJmMjkxYjBjNDYyMTk2OTgyYWY5NzUwMTQ0YTg="
// Test Album ID: 5rOHrnrRomvSJhQLGVtfJ8
export default class SpotifyProvider extends Provider
{
	constructor() {
		super()

		let AUTHORIZATION_CODE = sessionStorage.getItem('SPOTIFY_AT')

		if (!AUTHORIZATION_CODE && document.location.hash) {
			if ('spotify' === getHashParam('state')) {
				AUTHORIZATION_CODE = getHashParam('access_token')
				sessionStorage.setItem('SPOTIFY_AT', AUTHORIZATION_CODE)
			}
		}
		
		this.fetcher = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				Authorization: `Bearer ${AUTHORIZATION_CODE}`
			}
		})
	}

	async fetchTracks(sourceType, sourceId) {
		let tracks
		switch (sourceType)
		{
			case 'spotify_album':
			{
				const albumData = await this.fetchAlbum(sourceId)
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

	async fetchTrack(trackId) {
		const track = await this.fetchAPI(`tracks/${trackId}`)
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

	refreshAuthentication() {
		document.location = `https://accounts.spotify.com/authorize?client_id=${config.TMP.SPOTIFY}&response_type=token&state=spotify&redirect_uri=http://localhost:8080/#/play`
	}

	async fetchAPI(url) {
		try {
			const response = await this.fetcher.get(API_BASE_URL + url)
			return response.data
		}
		catch (error) {
			if (error.response) {
				if (error.response.status === 401) {
					this.refreshAuthentication()
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

	async fetchAlbum(albumId) {
		return this.fetchAPI(`albums/${albumId}`)
	}
}
