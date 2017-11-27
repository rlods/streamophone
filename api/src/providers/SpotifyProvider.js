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
			case 'ALBUM':
				tracks = await this.fetchTracksFromAlbum(sourceId)
				break
			case 'ARTIST':
				tracks = await this.fetchTracksFromArtist(sourceId)
				break
			case 'SEARCH':
				tracks = await this.fetchTracksFromSearch(sourceId)
				break
			default:
				throw new Error(`Unknown spotify source type "${sourceType}"`)
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
			console.log('Refreshing Spotify authentication')
			const response = await ACCOUNT_FETCHER.post('token')
			const { data } = response
			if (data && data.error)
				throw new Error(data.error)
			this.access_token = data.access_token
			console.log('Spotify authentication refresh succeeded', this.access_token)
		}
		catch (error) {
			console.log('Spotify authentication refresh failed', error)
		}
	}

	async fetchAPI(url) {
		for (let i = 0; i < 2; ++i) {
			try {
				console.log('Fetching Spotify', this.access_token)
				const response = await API_FETCHER.get(url, {
					headers: {
						Authorization: `Bearer ${this.access_token}`
					}
				})
				const { data } = response
				if (data && data.error)
					throw new Error(data.error)
				return data
			}
			catch (error) {
				if (error.response) {
					if (error.response.status === 401) {
						await this.refreshAuthentication()
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

	async fetchTracksFromAlbum(albumId) {
		const albums = await this.fetchAPI(`albums/${albumId}`)
		return albums.tracks.items.map(track => {
			// In that case we have to enrich each track data with the cover which is available in the album data
			track.cover = albums.images[0].url
			return track
		})
	}

	// https://developer.spotify.com/web-api/console/get-several-albums/#complete
	async fetchTracksFromArtist(artistId) {
		let albums = await this.fetchAPI(`artists/${artistId}/albums`)
		albums = (await this.fetchAPI(`albums?ids=${albums.items.map(album => album.id).join(',')}`)).albums
		return [].concat.apply([], albums.map(album => album.tracks.items.map(track => {
			// In that case we have to enrich each track data with the cover which is available in the album data
			track.cover = album.images[0].url
			return track
		})))
	}

	async fetchTracksFromSearch(query) {
		const search = await this.fetchAPI(`search?q=${encodeURI(query)}&type=track`)
		return search.tracks.items.map(track => {
			// In that case we have to enrich each track data with the cover which is available in the album data
			track.cover = track.album.images[0].url
			return track
		})
	}
}
