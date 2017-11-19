
export const changeSampleDefaultDuration = defaultDuration => dispatch => {
	sessionStorage.setItem('DEFAULT_SAMPLER_DURATION', defaultDuration)
	dispatch({
		type: 'SAMPLER_SET_DEFAULT_DURATION',
		data: { defaultDuration }
	})
}

export const changeSamplerStrategy = strategyId => dispatch => {
	sessionStorage.setItem('DEFAULT_SAMPLER_STRATEGY', strategyId)
	dispatch({
		type: 'SAMPLER_SET_STRATEGY',
		data: { strategyId }
	})
}

export const changeSampleAudioReady = (sampleIndex) => (dispatch, getState) => {
	const { sampler } = getState()
	if (sampler.tracks && sampleIndex >= 0 && sampleIndex < sampler.tracks.length) {
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_READY',
			data: { sampleIndex }
		})
	}
}

export const changeSampleBPM = (sampleIndex, bpm) => (dispatch, getState) => {
	const { sampler } = getState()
	if (sampler.tracks && sampleIndex >= 0 && sampleIndex < sampler.tracks.length) {
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_BPM',
			data: { sampleIndex, bpm }
		})
	}
}

export const changeSampleNormalizationVolume = (sampleIndex, volume) => (dispatch, getState, { app }) => {
	const { sampler } = getState()
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio) {
		audio.setVolume(volume * sampler.tracks[sampleIndex].volume2)
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_NORMALIZATION_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSampleSpeed = (sampleIndex, speed) => (dispatch, getState, { app }) => {
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio) {
		audio.setSpeed(speed)
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_SPEED',
			data: { sampleIndex, speed }
		})
	}
}

export const changeSampleVolume = (sampleIndex, volume) => (dispatch, getState, { app }) => {
	const { sampler } = getState()
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio) {
		audio.setVolume(sampler.tracks[sampleIndex].volume1 * volume)
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSampleStatus = (sampleIndex, playing) => (dispatch, getState, { app }) => {
	dispatch({
		type: 'SAMPLER_SET_SAMPLE_STATUS',
		data: { playing, sampleIndex }
	})
}

export const registerSampleCanvas = (sampleIndex, canvas) => (dispatch, getState, { app }) => {
	const audio = app.audioEngine.getAudio(sampleIndex)
	if (audio)
		audio.setCanvas(canvas)
}

export const changeSamples = tracks => (dispatch, getState) => {
	dispatch({
		type: 'SAMPLER_SET_SAMPLES',
		data: { tracks }
	})
}

// --------------------------------------------------------------

export const handleKeyDown = keyCode => async (dispatch, getState, { app }) => {
	if (keyCode === 32) // SPACE
		app.audioEngine.recorder.snapshot()
	else if (app.strategy)
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
