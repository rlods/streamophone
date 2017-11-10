
export const changePlaylistId = id => dispatch => dispatch({
	type: 'PLAYLIST_SET',
	data: {
		id
	}
})

export const loadPlaylist = () => dispatch => {}
