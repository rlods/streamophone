
export const changePlayerStatus = playing => (dispatch, getState, { app }) => {
	dispatch({
		type: 'PLAYER_SET_STATUS',
		data: { playing }
	})
}

export const loadPlayer = data => (dispatch, getState, { app }) => {
	app.audioPlayer.loadData(data)
	dispatch({
		type: 'PLAYER_SET_TRACKS',
		data: { tracks: app.audioPlayer.tracks }
	})
}

export const registerPlayerCanvas = canvas => (dispatch, getState, { app }) => {
	app.audioPlayer.setCanvas(canvas)
}

// ------------------------------------------------------------------

export const play = () => (dispatch, getState, { app }) => {
	app.audioPlayer.play()
}

export const pause = () => (dispatch, getState, { app }) => {
	app.audioPlayer.pause()
}
