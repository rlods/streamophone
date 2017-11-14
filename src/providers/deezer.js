import jsonp from 'jsonp'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.deezer.com/'

// ------------------------------------------------------------------

export default class DeezerProvider
{
	// constructor() {
	// }

	fetchAPI(url) {
		return new Promise((resolve, reject) => {
			jsonp(API_BASE_URL + url + '?output=jsonp&strict=on', null, (err, data) => {
				if (err)
					reject(err)
				else if (data && data.error)
					reject(data.error)
				else
					resolve(data)
			})
		})
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
				tracks = artistTracksData.data
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
			playing: false,
			preview: track.preview,
			readable: track.readable,
			title: track.title,
			url: track.link,
			volume1: 0.5,
			volume2: 1.0
		}))
	}

	async fetchTrack(trackId) {
		const track = await this.fetchAPI(`track/${trackId}`)
		return {
			cover: track.album.cover_medium,
			id: track.id,
			playing: false,
			preview: track.preview,
			readable: track.readable,
			title: track.title,
			url: track.link,
			volume1: 0.5,
			volume2: 1.0
		}
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
