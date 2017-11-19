
export const changePlayerSampleStatus = (sampleIndex, playing) => dispatch => {
	dispatch({
		type: 'PLAYER_SET_SAMPLE_STATUS',
		data: { playing, sampleIndex }
	})
}

export const changePlayerStatus = playing => dispatch => {
	dispatch({
		type: 'PLAYER_SET_STATUS',
		data: { playing }
	})
}

// ------------------------------------------------------------------

export const loadPlayer = data => async (dispatch, getState, { app }) => {
	await app.audioPlayer.loadData(data)
	dispatch({
		type: 'PLAYER_SET_TRACKS',
		data: { tracks: app.audioPlayer.tracks }
	})
}

export const play = () => (dispatch, getState, { app }) => {
	app.audioPlayer.play()
}

export const pause = () => (dispatch, getState, { app }) => {
	app.audioPlayer.pause()
}

export const registerPlayerCanvas = canvas => (dispatch, getState, { app }) => {
	app.audioPlayer.attachCanvas(canvas)
}
