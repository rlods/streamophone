import config from '../config'

// --------------------------------------------------------------

export const changeSampleDuration = sampleDuration => dispatch => {
	sessionStorage.setItem('DEFAULT_SAMPLING_DURATION', sampleDuration)
	return dispatch({
		type: 'SAMPLING_SET_SAMPLE_DURATION',
		data: { sampleDuration }
	})
}

export const changeSamplingStrategy = strategyId => dispatch => {
	sessionStorage.setItem('DEFAULT_SAMPLING_STRATEGY', strategyId)
	return dispatch({
		type: 'SAMPLING_SET_STRATEGY',
		data: { strategyId }
	})
}

export const changeSamplingTransformation = transformation => dispatch => {
	sessionStorage.setItem('DEFAULT_SAMPLING_TRANSFORMATION', transformation)
	dispatch({
		type: 'SAMPLING_SET_TRANSFORMATION',
		data: { transformation }
	})
}

// --------------------------------------------------------------

export const changeSampleBPM = (sampleIndex, bpm) => dispatch => dispatch({
	type: 'SAMPLING_SET_TRACK_BPM',
	data: { sampleIndex, bpm }
})

export const changeSampleNormalizationVolume = (sampleIndex, volume) => dispatch => dispatch({
	type: 'SAMPLING_SET_TRACK_NORMALIZATION_VOLUME',
	data: { sampleIndex, volume }
})

export const changeSampleVolume = (sampleIndex, volume) => dispatch => dispatch({
	type: 'SAMPLING_SET_SAMPLE_VOLUME',
	data: { sampleIndex, volume }
})

export const changeSamplingTracks = (audios, tracks) => dispatch => dispatch({
	type: 'SAMPLING_SET_TRACKS',
	data: { audios, tracks }
})

export const changeSampleStatus = (sampleIndex, playing) => dispatch => dispatch({
	type: 'SAMPLING_SET_SAMPLE_STATUS',
	data: { playing, sampleIndex }
})

// --------------------------------------------------------------

export const handleKeyDown = keyCode => async (dispatch, getState, { drivers }) => {
	const driver = drivers['basic'] // TODO what if basic driver is not registered ?
	if (driver && driver.strategy) {
		driver.strategy.handleKeyDown(dispatch, keyCode)
	}
}

export const handleKeyUp = keyCode => (dispatch, getState, { drivers }) => {
	const driver = drivers['basic'] // TODO what if basic driver is not registered ?
	if (driver && driver.strategy) {
		driver.strategy.handleKeyUp(dispatch, keyCode)
	}
}

export const setSampleVolume = (sampleIndex, volume) => (dispatch, getState) => {
	const { sampling } = getState()
	const { audios, tracks } = sampling
	if (audios && audios.length > 0) {
		const indexMod = Math.abs(sampleIndex) % audios.length
		const audio = audios[indexMod]
		const track = tracks[indexMod]
		const volume2 = volume < 0 ? 0 : volume > 1 ? 1 : volume
		audio.volume = track.volume1 * volume2
		changeSampleVolume(sampleIndex, volume2)
	}
}

export const startSample = sampleIndex => async (dispatch, getState) => {
	const { sampling } = getState()
	const { audios, tracks, sampleDuration } = sampling
	if (audios && audios.length > 0) {
		const indexMod = Math.abs(sampleIndex) % audios.length
		const audio = audios[indexMod]
		const track = tracks[indexMod]
		if (!track.playing && audio.readyState) {
			audio.addEventListener('pause', () => dispatch(changeSampleStatus(sampleIndex, false)))
			audio.currentTime = 0
			// audio.loop = true TODO as an option
			await audio.play()
			dispatch(changeSampleStatus(sampleIndex, true))
			if (sampleDuration > 0 && sampleDuration < config.SAMPLE_MAX_DURATION) {
				setTimeout(() => dispatch(stopSample(sampleIndex)), sampleDuration)
			}
		}
		else {
			console.log('Audio track is not available or ready', audio.readyState, track)
		}
	}
}

export const stopSample = sampleIndex => async (dispatch, getState) => {
	const { sampling } = getState()
	const { audios, tracks } = sampling
	if (audios && audios.length > 0) {
		const indexMod = Math.abs(sampleIndex) % audios.length
		const audio = audios[indexMod]
		const track = tracks[indexMod]
		if (track.playing)
			audio.pause()
	}
}