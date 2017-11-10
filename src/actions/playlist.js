import jsonp from 'jsonp'

// ------------------------------------------------------------------

export const changePlaylistId = id => dispatch => dispatch({
	type: 'PLAYLIST_SET_ID',
	data: {
		id
	}
})

export const loadPlaylist = () => async (dispatch, getState) => {
	const playlistId = getState().playlist.id
	jsonp(`https://api.deezer.com/playlist/${playlistId}?output=jsonp&strict=on`, null, function (err, data) {
	 	const tracks = data.tracks.data
	 	dispatch({
			type: 'PLAYLIST_SET_TRACKS',
			data: {
				tracks
			}
		})
	})
}
