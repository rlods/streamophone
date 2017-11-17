
export const changeSampleDuration = duration => dispatch => {
	sessionStorage.setItem('DEFAULT_SAMPLING_DURATION', duration)
	return dispatch({
		type: 'SAMPLING_SET_SAMPLE_DURATION',
		data: { duration }
	})
}

export const changeSamplingStrategy = strategyId => dispatch => {
	sessionStorage.setItem('DEFAULT_SAMPLING_STRATEGY', strategyId)
	return dispatch({
		type: 'SAMPLING_SET_STRATEGY',
		data: { strategyId }
	})
}

// --------------------------------------------------------------

export const changeSampleAudioReady = (sampleIndex) => (dispatch, getState) => {
	const { sampling } = getState()
	if (sampling.tracks && sampleIndex >= 0 && sampleIndex < sampling.tracks.length) {
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_READY',
			data: { sampleIndex }
		})
	}
}

export const changeSampleBPM = (sampleIndex, bpm) => (dispatch, getState) => {
	const { sampling } = getState()
	if (sampling.tracks && sampleIndex >= 0 && sampleIndex < sampling.tracks.length) {
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_BPM',
			data: { sampleIndex, bpm }
		})
	}
}

export const changeSampleNormalizationVolume = (sampleIndex, volume) => (dispatch, getState, { app }) => {
	const { sampling } = getState()
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio) {
		audio.setVolume(volume * sampling.tracks[sampleIndex].volume2)
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_NORMALIZATION_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSampleSpeed = (sampleIndex, speed) => (dispatch, getState, { app }) => {
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio) {
		audio.setSpeed(speed)
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_SPEED',
			data: { sampleIndex, speed }
		})
	}
}

export const changeSampleVolume = (sampleIndex, volume) => (dispatch, getState, { app }) => {
	const { sampling } = getState()
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio) {
		audio.setVolume(sampling.tracks[sampleIndex].volume1 * volume)
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSampleStatus = (sampleIndex, playing) => (dispatch, getState, { app }) => {
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio) {
		if (playing) audio.start()
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_STATUS',
			data: { playing, sampleIndex }
		})
	}
}

export const registerSampleCanvas = (sampleIndex, canvas) => (dispatch, getState, { app }) => {
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio)
		audio.setCanvas(canvas)
}

export const changeSamples = tracks => (dispatch, getState) => {
	dispatch({
		type: 'SAMPLING_SET_SAMPLES',
		data: { tracks }
	})
}

// --------------------------------------------------------------

export const handleKeyDown = keyCode => async (dispatch, getState, { app }) => {
	if (app.strategy)
		app.strategy.handleKeyDown(dispatch, keyCode)
}

export const handleKeyUp = keyCode => (dispatch, getState, { app }) => {
	if (app.strategy)
		app.strategy.handleKeyUp(dispatch, keyCode)
}

export const handleMidiEvent = (channel, key, velocity) => (dispatch, getState, { app }) => {
	if (app.strategy)
		app.strategy.handleMidiEvent(dispatch, channel, key, velocity)
}

export const handleSocketEvent = message => (dispatch, getState, { app }) => {
	if (app.strategy)
		app.strategy.handleSocketMessage(dispatch, message)
}

// --------------------------------------------------------------

export const startSample = sampleIndex => async (dispatch, getState, { app }) => {
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio)
		audio.start()
}

export const stopSample = sampleIndex => async (dispatch, getState, { app }) => {
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio)
		audio.stop()
}
