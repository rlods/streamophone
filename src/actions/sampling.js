
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

export const changeSampleNormalizationVolume = (sampleIndex, volume) => (dispatch, getState, { audioEngine }) => {
	const { sampling } = getState()
	const audio = audioEngine.getAudio(sampleIndex)
	if (audio) {
		audio.setVolume(volume * sampling.tracks[sampleIndex].volume2)
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_NORMALIZATION_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSampleSpeed = (sampleIndex, speed) => (dispatch, getState, { audioEngine }) => {
	const audio = audioEngine.getAudio(sampleIndex)
	if (audio) {
		audio.setSpeed(speed)
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_SPEED',
			data: { sampleIndex, speed }
		})
	}
}

export const changeSampleVolume = (sampleIndex, volume) => (dispatch, getState, { audioEngine }) => {
	const { sampling } = getState()
	const audio = audioEngine.getAudio(sampleIndex)
	if (audio) {
		audio.setVolume(sampling.tracks[sampleIndex].volume1 * volume)
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSampleStatus = (sampleIndex, playing) => (dispatch, getState, { audioEngine }) => {
	const audio = audioEngine.getAudio(sampleIndex)
	if (audio) {
		if (playing) audio.start()
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_STATUS',
			data: { playing, sampleIndex }
		})
	}
}

export const registerSampleCanvas = (sampleIndex, canvas) => (dispatch, getState, { audioEngine }) => {
	const audio = audioEngine.getAudio(sampleIndex)
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

export const handleKeyDown = keyCode => async (dispatch, getState, { drivers }) => {
	const driver = drivers['basic'] // TODO what if basic driver is not registered ?
	if (driver && driver.strategy)
		driver.strategy.handleKeyDown(dispatch, keyCode)
}

export const handleKeyUp = keyCode => (dispatch, getState, { drivers }) => {
	const driver = drivers['basic'] // TODO what if basic driver is not registered ?
	if (driver && driver.strategy)
		driver.strategy.handleKeyUp(dispatch, keyCode)
}

export const startSample = sampleIndex => async (dispatch, getState, { audioEngine }) => {
	const audio = audioEngine.getAudio(sampleIndex)
	if (audio)
		audio.start()
}

export const stopSample = sampleIndex => async (dispatch, getState, { audioEngine }) => {
	const audio = audioEngine.getAudio(sampleIndex)
	if (audio)
		audio.stop()
}
