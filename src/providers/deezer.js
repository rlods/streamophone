import jsonp from 'jsonp'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.deezer.com/'

// ------------------------------------------------------------------

const fetchAPI = url => new Promise((resolve, reject) => {
	jsonp(API_BASE_URL + url + '?output=jsonp&strict=on', null, (err, data) => {
		if (err)
			reject(err)
		else if (data && data.error)
			reject(data.error)
		else
			resolve(data)
	})
})

// ------------------------------------------------------------------

const fetchAlbum = async albumId => fetchAPI(`album/${albumId}`)

// ------------------------------------------------------------------

const fetchArtistTracks = async artistId => fetchAPI(`artist/${artistId}/radio`)

// ------------------------------------------------------------------

const fetchPlaylist = async playlistId => fetchAPI(`playlist/${playlistId}`)

// ------------------------------------------------------------------

export const fetchTracks = async (sourceType, sourceId) => {
	let tracks
	switch (sourceType)
	{
		case 'album':
		{
			const albumData = await fetchAlbum(sourceId)
			tracks = albumData.tracks.data.map(trackData => {
				// In that case we have to enrich each track data with the cover which is available in the album data
				trackData.album = { cover_medium: albumData.cover_medium }
				return trackData
			})
			break
		}
		case 'artist':
		{
			const artistTracksData = await fetchArtistTracks(sourceId)
			tracks = artistTracksData.data
			break
		}
		case 'playlist':
		{
			const playlistData = await fetchPlaylist(sourceId)
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

export const fetchTrack = async trackId => {
	const trackData = await fetchAPI(`track/${trackId}`)
	return {
		cover: trackData.album.cover_medium,
		id: trackData.id,
		playing: false,
		preview: trackData.preview,
		readable: trackData.readable,
		title: trackData.title,
		url: trackData.link,
		volume1: 0.5,
		volume2: 1.0
	}
}
