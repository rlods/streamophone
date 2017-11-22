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
// Test Album ID: 5rOHrnrRomvSJhQLGVtfJ8, 0QhwxYDUougJiVDtyN4Lhm
// Test Artist ID: 0OdUWJ0sBjDrqHygGUXeCF
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
			case 'album':
			{
				tracks = await this.fetchAlbumTracks(sourceId)
				break
			}
			case 'artist':
			{
				tracks = await this.fetchArtistTracks(sourceId)
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
			preview: track.preview_url,
			readable: !!track.preview_url,
			title: track.name,
			url: track.external_urls.spotify
		}))
	}

	refreshAuthentication() {
		document.location = `https://accounts.spotify.com/authorize?client_id=${config.TMP.SPOTIFY}&response_type=token&state=spotify&redirect_uri=${config.BASE_URL}`
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

	async fetchAlbumTracks(albumId) {
		const albums = await this.fetchAPI(`albums/${albumId}`)
		return albums.tracks.items.map(track => {
			// In that case we have to enrich each track data with the cover which is available in the album data
			track.cover = albums.images[0].url
			return track
		})
	}

	async fetchArtistTracks(artistId) {
		const albums = await this.fetchAPI(`artists/${artistId}/albums`)
		const albumIds = albums.items.map(album => album.id).join(',')
		const albumsDetailed = await this.fetchAPI(`albums?ids=${albumIds}`) // https://developer.spotify.com/web-api/console/get-several-albums/#complete
		return [].concat.apply([], albumsDetailed.albums.map(album => album.tracks.items.map(track => {
			// In that case we have to enrich each track data with the cover which is available in the album data
			track.cover = album.images[0].url
			return track
		})))
	}
}
