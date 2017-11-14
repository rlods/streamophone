import jsonp from 'jsonp'
//
import config from '../config'

// ------------------------------------------------------------------

// https://freesound.org/apiv2/packs/16873/sounds?format=json
// https://freesound.org/apiv2/sounds/395246?format=json

const API_BASE_URL = 'https://freesound.org/apiv2/'
const API_KEY = config.TMP.FREESOUND
const SOUND_IMG = require('../assets/sound.png')

// ------------------------------------------------------------------

const fetchAPI = url => new Promise((resolve, reject) => {
	jsonp(API_BASE_URL + url + `?format=jsonp&token=${API_KEY}`, null, (err, data) => {
		if (err)
			reject(err)
		else if (data && data.error)
			reject(data.error)
		else
			resolve(data)
	})
})

const fetchPackSounds = async packId => fetchAPI(`packs/${packId}/sounds`)

export const fetchTrack = async trackId => {
	const track = await fetchAPI(`sounds/${trackId}`)
	const preview = track.previews ? track.previews['preview-lq-mp3'] : null
	return {
		cover: SOUND_IMG,
		id: track.id,
		playing: false,
		preview,
		readable: !!preview,
		title: track.name,
		url: track.url,
		volume1: 0.5,
		volume2: 1.0
	}
}

export const fetchTracks = async (sourceType, sourceId) => {
	let tracks
	switch (sourceType)
	{
		case 'freesound_pack':
			tracks = (await fetchPackSounds(sourceId)).results.map(trackData => fetchTrack(trackData.id))
			break
		default:
			throw new Error(`Unknown spotify source type "${sourceType}"`)
	}
	return await Promise.all(tracks)
}
