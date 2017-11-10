import jsonp from 'jsonp'

// ------------------------------------------------------------------

export const changePlaylistId = id => dispatch => dispatch({
	type: 'PLAYLIST_SET_ID',
	data: {
		id
	}
})

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

export const loadPlaylist = () => async (dispatch, getState) => {
    const state = getState()
	const playlistId = state.playlist.id
	const samplingCount = state.sampling.count
    
	jsonp(`https://api.deezer.com/playlist/${playlistId}?output=jsonp&strict=on`, null, function (err, data) {
        const tracks = getRandomSubarray(data.tracks.data, samplingCount).map(item => new Audio(item.preview))
	 	dispatch({
			type: 'PLAYLIST_SET_TRACKS',
			data: {
				tracks
			}
		})
	})
}
