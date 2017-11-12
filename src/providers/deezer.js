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

export const fetchPlaylist = async playlistId => fetchAPI(`playlist/${playlistId}`)

export const fetchTrack = async trackId => fetchAPI(`track/${trackId}`)
