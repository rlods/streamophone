import { fetchDeezerAPI, shuffleArray } from '../tools'

// ------------------------------------------------------------------

const DEEZER_API_SIMULTANEOUS_MAX_CALLS = 15

// ------------------------------------------------------------------

export const changePlaylistId = id => dispatch => dispatch({
	type: 'PLAYLIST_SET_ID',
	data: {
		id
	}
})

export const chunkArray = (array, size, cb) => {
	const results = []
	for (let i = 0, j = array.length; i < j; i += size)
		results.push(cb(array.slice(i, i + size)))
	return results
}

export const loadTracks = async tracksIds => {
	const tracks = await Promise.all(tracksIds.map(async trackId => fetchDeezerAPI(`track/${trackId}`)))
	const audios = tracks.map(track => {
		track.volume1 = track.gain === 0 ? 0.5 : 0.5 * Math.pow(10, ((-12 - track.gain) / 20))
		track.volume2 = 1.0
		const audio = new Audio(track.preview)
		audio.volume = track.volume1 * track.volume2
		return audio
	})
	return {
		audios,
		tracks
	}
}

export const loadPlaylist = () => async (dispatch, getState) => {
    const state = getState()
	const playlist = await fetchDeezerAPI(`playlist/${state.playlist.id}`)
	const tracksIds = shuffleArray(playlist.tracks.data, state.sampling.count).map(track => track.id)

	const chunks = await Promise.all(chunkArray(tracksIds, DEEZER_API_SIMULTANEOUS_MAX_CALLS, loadTracks))
	const audios = Array.prototype.concat.apply([], chunks.map(chunk => chunk.audios))
	const tracks = Array.prototype.concat.apply([], chunks.map(chunk => chunk.tracks))

	dispatch({
		type: 'PLAYLIST_SET_DATA',
		data: {
			playlist
		}
	})
	dispatch({
		type: 'SAMPLING_SET_TRACKS',
		data: {
			audios,
			tracks
		}
	})
}
