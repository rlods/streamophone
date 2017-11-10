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
	const playlistId = state.playlist.id
	const samplingCount = state.sampling.count
    
    const playlistUrl = `playlist/${playlistId}`
	const playlistData = await fetchDeezerAPI(playlistUrl)
	// const trackUrl = `track/${trackId}`

	const tracks = shuffleArray(playlistData.tracks.data, samplingCount).map(item => new Audio(item.preview))
	dispatch({
		type: 'PLAYLIST_SET_TRACKS',
		data: {
			tracks
		}
	})
}
