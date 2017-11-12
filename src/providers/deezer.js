import jsonp from 'jsonp'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.deezer.com/'

export const fetchAPI = url => new Promise((resolve, reject) => {
	jsonp(API_BASE_URL + url + '?output=jsonp&strict=on', null, (err, data) => {
		if (err)
			reject(err)
		else if (data && data.error)
			reject(data.error)
		else
			resolve(data)
	})
})

export const fetchAlbum = async albumId => fetchAPI(`album/${albumId}`)

export const fetchArtistTracks = async artistId => fetchAPI(`artist/${artistId}/radio`)

export const fetchPlaylist = async playlistId => fetchAPI(`playlist/${playlistId}`)

export const fetchTrack = async trackId => fetchAPI(`track/${trackId}`)

export const validateTrack = track => !!track.preview

export const extractTrackCover = trackData => trackData.album.cover_medium

export const extractTracksData = (sourceType, sourceData) => {
	switch (sourceType)
	{
		case 'album':
			// In that case we have to enrich each track data with the cover which is available in the album data
			sourceData.tracks.data.forEach(track => track.album = { cover_medium: sourceData.cover_medium })
			return sourceData.tracks.data
		case 'artist':
			return sourceData.data
		case 'playlist':
			return sourceData.tracks.data
		default:
			return sourceData.tracks.data
	}
	
}
