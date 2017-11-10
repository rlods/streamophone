import { fetchDeezerAPI, shuffleArray } from '../tools'

// ------------------------------------------------------------------

export const changePlaylistId = id => dispatch => dispatch({
	type: 'PLAYLIST_SET_ID',
	data: {
		id
	}
})

export const loadPlaylist = () => async (dispatch, getState) => {
    const state = getState()
	const playlist = await fetchDeezerAPI(`playlist/${state.playlist.id}`)
	let tracks = shuffleArray(playlist.tracks.data, state.sampling.count)
	tracks = tracks.map(async track => fetchDeezerAPI(`track/${track.id}`))
	tracks = await Promise.all(tracks)
	const audios = tracks.map(track => {
		const audio = new Audio(track.preview)
		audio.volume = track.gain === 0 ? 0.5 : 0.5 * Math.pow(10, ((-12 - track.gain) / 20))
		return audio
	})
	dispatch({
		type: 'PLAYLIST_SET_TRACKS',
		data: {
			audios,
			tracks
		}
	})
}
