
export const changePlayerSamples = tracks => dispatch => {
	dispatch({
		type: 'PLAYER_SET_SAMPLES',
		data: { tracks }
	})
}

export const changePlayerStatus = playing => dispatch => {
	dispatch({
		type: 'PLAYER_SET_STATUS',
		data: { playing }
	})
}

// ------------------------------------------------------------------

export const changePlayerSampleReady = sampleIndex => dispatch => {
	dispatch({
		type: 'PLAYER_SET_SAMPLE_READY',
		data: { sampleIndex }
	})
}

export const changePlayerSampleStatus = (sampleIndex, playing) => dispatch => {
	dispatch({
		type: 'PLAYER_SET_SAMPLE_STATUS',
		data: { playing, sampleIndex }
	})
}

// ------------------------------------------------------------------

export const loadPlayer = data => async (dispatch, getState, { app }) => {
	try {
		app.audioPlayer.initFromData(data)
	}
	catch (error) {
		const message = error.response && error.response.data && error.response.data.message ? error.response.data.message : error
		console.log('Cannot load player', message)
		dispatch(displayError(`Cannot load player: ${message}`))
	}
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
