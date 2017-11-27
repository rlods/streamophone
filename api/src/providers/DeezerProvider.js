import axios from 'axios'
//
import Provider from './Provider'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.deezer.com/'
const API_FETCHER = axios.create({ baseURL: API_BASE_URL })
const ENRICHMENT_CHUNK = 10
const ENRICHMENT_DELAY = 500

// ------------------------------------------------------------------

class EnrichmentProcessor // TODO re-enable
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

	async fetchAPI(url) {
		console.log('Fetching Deezer', url)
		const response = await API_FETCHER.get(url)
		const { data } = response
		if (data && data.error)
			throw new Error(data.error)
		return data
	}

	enrichTracks(tracks, cb) {
		this.enricher.register(tracks, cb)
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
			case 'PLAYLIST':
				tracks = await this.fetchTracksFromPlaylist(sourceId)
				break
			case 'SEARCH':
				tracks = await this.fetchTracksFromSearch(sourceId)
				break
			default:
				throw new Error(`Unknown Deezer source type "${sourceType}"`)
		}
		return tracks
		.filter(track => !!track.preview && track.readable)
		.map(track => ({
			cover: track.album.cover_medium,
			id: track.id,
			preview: track.preview,
			title: track.title,
			url: track.link
		}))
	}

	async fetchTracksFromAlbum(albumId) {
		const album = await this.fetchAPI(`album/${albumId}`)
		return album.tracks.data.map(track => {
			// In that case we have to enrich each track data with the cover which is available in the album data
			track.album = { cover_medium: album.cover_medium }
			return track
		})
	}

	async fetchTracksFromArtist(artistId) {
		const artist = await this.fetchAPI(`artist/${artistId}/radio`)
		return artist.data.map(track => {
			// In that case we have to enrich each track data with the cover which is available in the album data
			track.link = 'https://www.deezer.com/track/' + track.id
			return track
		})
	}

	async fetchTracksFromPlaylist(playlistId) {
		const playlist = await this.fetchAPI(`playlist/${playlistId}`)
		return playlist.tracks.data
	}

	async fetchTracksFromSearch(query) {
		const search = await this.fetchAPI(`search/track?q=${encodeURI(query)}`)
		return search.data
	}
}
