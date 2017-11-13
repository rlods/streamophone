import jsonp from 'jsonp'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.deezer.com/'

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

const fetchAlbum = async albumId => fetchAPI(`album/${albumId}`)

const fetchArtistTracks = async artistId => fetchAPI(`artist/${artistId}/radio`)

const fetchPlaylist = async playlistId => fetchAPI(`playlist/${playlistId}`)

export const fetchSourceData = async (sourceType, sourceId) => {
	switch (sourceType)
	{
		case 'album':
		{
			// In that case we have to enrich each track data with the cover which is available in the album data
			const albumData = await fetchAlbum(sourceId)
			albumData.tracks.data.forEach(track => track.album = { cover_medium: albumData.cover_medium })
			return albumData.tracks.data
		}
		case 'artist':
		{
			const artistTracksData = await fetchArtistTracks(sourceId)
			return artistTracksData.data
		}
		case 'playlist':
		{
			const playlistData = await fetchPlaylist(sourceId)
			return playlistData.tracks.data
		}
		default:
		{
			throw new Error(`Unknown source type "${sourceType}"`)
		}
	}
	
}

export const fetchTrack = async trackId => fetchAPI(`track/${trackId}`)

export const validateTrack = track => !!track.preview && track.readable // readable means the track is available in current country

export const extractTrackCover = trackData => trackData.album.cover_medium
