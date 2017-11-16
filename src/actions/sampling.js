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

export const changeSampleNormalizationVolume = (sampleIndex, volume) => (dispatch, getState) => {
	const { sampling } = getState()
	if (sampling.tracks && sampleIndex >= 0 && sampleIndex < sampling.tracks.length) {
		sampling.audios[sampleIndex].setVolume(volume * sampling.tracks[sampleIndex].volume2)
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_NORMALIZATION_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSampleSpeed = (sampleIndex, speed) => (dispatch, getState) => {
	const { sampling } = getState()
	if (sampling.tracks && sampleIndex >= 0 && sampleIndex < sampling.tracks.length) {
		sampling.audios[sampleIndex].setSpeed(speed)
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_SPEED',
			data: { sampleIndex, speed }
		})
	}
}

export const changeSampleVolume = (sampleIndex, volume) => (dispatch, getState) => {
	const { sampling } = getState()
	if (sampling.tracks && sampleIndex >= 0 && sampleIndex < sampling.tracks.length) {
		sampling.audios[sampleIndex].setVolume(sampling.tracks[sampleIndex].volume1 * volume)
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSamplingTracks = (audios, tracks) => (dispatch, getState) => {
	dispatch({
		type: 'SAMPLING_SET_TRACKS',
		data: { audios, tracks }
	})
}

export const changeSampleStatus = (sampleIndex, playing) => (dispatch, getState) => {
	const { sampling } = getState()
	if (sampling.tracks && sampleIndex >= 0 && sampleIndex < sampling.tracks.length) {
		dispatch({
			type: 'SAMPLING_SET_SAMPLE_STATUS',
			data: { playing, sampleIndex }
		})
	}
}

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

export const startSample = sampleIndex => async (dispatch, getState) => {
	const { sampling } = getState()
	const { audios, tracks, sampleDuration } = sampling
	if (audios && audios.length > 0) {
		const indexMod = Math.abs(sampleIndex) % audios.length
		const audio = audios[indexMod]
		const track = tracks[indexMod]
		if (!track.playing && audio.ready) {
			audio.onStop = () => dispatch(changeSampleStatus(sampleIndex, false))
			// audio.setLoop(true) TODO as an option
			audio.start()
			dispatch(changeSampleStatus(sampleIndex, true))
			if (sampleDuration > 0 && sampleDuration < config.SAMPLE_MAX_DURATION) {
				setTimeout(() => dispatch(stopSample(sampleIndex)), sampleDuration)
			}
		}
		else {
			console.log('Audio track is not available or ready')
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
			audio.stop()
	}
}
