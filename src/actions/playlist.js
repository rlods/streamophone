import { fetchDeezerAPI } from '../tools'

// ------------------------------------------------------------------

const shuffleArray = (arr, size) => {
    const shuffled = arr.slice(0)
    let i = arr.length, temp, index
    while (i--) {
        index = Math.floor((i + 1) * Math.random())
        temp = shuffled[index]
        shuffled[index] = shuffled[i]
        shuffled[i] = temp
    }
    return shuffled.slice(0, size)
}

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
	fetchDeezerAPI(playlistUrl).then(data => {
		//const trackUrl = `track/${trackId}`

        const tracks = shuffleArray(data.tracks.data, samplingCount).map(item => new Audio(item.preview))
	 	dispatch({
			type: 'PLAYLIST_SET_TRACKS',
			data: {
				tracks
			}
		})
	})
}
