import jsonp from 'jsonp'
//
import Provider from './Provider'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.deezer.com/'
const ENRICHMENT_CHUNK = 10
const ENRICHMENT_DELAY = 500

// ------------------------------------------------------------------

class EnrichmentProcessor
{
	constructor(provider) {
		this.baseIndex = 0
		this.cb = null
		this.provider = provider
		this.tracks = null
		this.interval = null
	}

	register(tracks, cb) {
		if (this.interval) {
			clearInterval(this.interval)
			this.baseIndex = 0
			this.cb = null
			this.interval = null
			this.tracks = null
		}
		if (cb && tracks && tracks.length > 0) {
			this.cb = cb
			this.tracks = tracks.slice() // we have to copy the given tracks because we'll modify it in process
			this.interval = setInterval(this.process.bind(this), ENRICHMENT_DELAY)
		}
	}

	async process() {
		const tracks = this.tracks.splice(0, ENRICHMENT_CHUNK)
		if (tracks.length > 0) {
			const enrichedTracks = await Promise.all(tracks.map(async (track, index) => {
				const { id, bpm, gain } = await this.provider.fetchAPI(`track/${track.id}`)
				return {
					id,
					bpm,
					gain
				}
			}))
			this.cb(this.baseIndex, enrichedTracks)
			this.baseIndex += ENRICHMENT_CHUNK
		}
	}
}

// ------------------------------------------------------------------

export default class DeezerProvider extends Provider
{
	constructor() {
		super()
		this.enricher = new EnrichmentProcessor(this)
	}

	fetchAPI(url) {
		return new Promise((resolve, reject) => {
			const fullUrl = API_BASE_URL + url + '?output=jsonp&strict=on'
			jsonp(fullUrl, null, (err, data) => {
				if (err)
					reject(err)
				else if (data && data.error)
					reject(data.error)
				else
					resolve(data)
			})
		})
	}

	enrichTracks(tracks, cb) {
		this.enricher.register(tracks, cb)
	}

	async fetchTracks(sourceType, sourceId) {
		let tracks
		switch (sourceType)
		{
			case 'album':
			{
				const albumData = await this.fetchAlbum(sourceId)
				tracks = albumData.tracks.data.map(track => {
					// In that case we have to enrich each track data with the cover which is available in the album data
					track.album = { cover_medium: albumData.cover_medium }
					return track
				})
				break
			}
			case 'artist':
			{
				const artistTracksData = await this.fetchArtistTracks(sourceId)
				tracks = artistTracksData.data.map(track => {
					// In that case we have to enrich each track data with the cover which is available in the album data
					track.link = 'https://www.deezer.com/track/' + track.id
					return track
				})
				break
			}
			case 'playlist':
			{
				const playlistData = await this.fetchPlaylist(sourceId)
				tracks = playlistData.tracks.data
				break
			}
			default:
			{
				throw new Error(`Unknown deezer source type "${sourceType}"`)
			}
		}
		return tracks.map(track => ({
			cover: track.album.cover_medium,
			id: track.id,
			preview: track.preview,
			readable: track.readable,
			title: track.title,
			url: track.link
		}))
	}

	async fetchAlbum(albumId) {
		return this.fetchAPI(`album/${albumId}`)
	}

	async fetchArtistTracks(artistId) {
		return this.fetchAPI(`artist/${artistId}/radio`)
	}

	async fetchPlaylist(playlistId) {
		return this.fetchAPI(`playlist/${playlistId}`)
	}
}
