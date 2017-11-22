import axios from 'axios'
//
import config from '../config'
import Provider from './Provider'

// ------------------------------------------------------------------

const KEY = new Buffer(`${config.TMP.SPOTIFY}:${config.TMP.SPOTIFY_SECRET}`).toString('base64')

const API_BASE_URL = 'https://api.spotify.com/v1/'
const API_FETCHER = axios.create({ baseURL: API_BASE_URL })

const ACCOUNT_FETCHER = axios.create({
	baseURL: 'https://accounts.spotify.com/api/',
	params:{
		grant_type: 'client_credentials'
	},
	headers: {
		'Authorization': `Basic ${KEY}`,
		'Content-Type': 'application/x-www-form-urlencoded'
	}
})

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
		this.access_token = null
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
		return tracks
		.filter(track => !!track.preview_url)
		.map(track => ({
			cover: track.cover,
			id: track.id,
			preview: track.preview_url,
			title: track.name,
			url: track.external_urls.spotify
		}))
	}

	async refreshAuthentication() {
		try {
			const response = await ACCOUNT_FETCHER.post('token')
			const { data } = response
			if (data && data.error)
				throw new Error(data.error)
			this.access_token = data.access_token
			console.log('Authentication refresh succeeded', this.access_token)
		}
		catch (error) {
			console.log('Authentication refresh failed', error)
		}
	}

	async fetchAPI(url) {
		let retry = true
		while (retry) {
			try {
				retry = false
				const response = await API_FETCHER.get(url, {
					headers: {
						Authorization: `Bearer ${this.access_token}`
					}
				})
				const { data } = response
				if (data && data.error)
					throw new Error(data.error)
				return  data
			}
			catch (error) {
				if (error.response) {
					if (error.response.status === 401) {
						await this.refreshAuthentication()
						retry = true
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
