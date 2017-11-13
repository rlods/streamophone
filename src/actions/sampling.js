import config from '../config'

// --------------------------------------------------------------

export const changeSampleDuration = sampleDuration => dispatch => dispatch({
	type: 'SAMPLING_SET_SAMPLE_DURATION',
	data: { sampleDuration }
})

export const changeSampleNormalizationVolume = (trackId, volume) => dispatch => dispatch({
	type: 'SAMPLING_SET_TRACK_NORMALIZATION_VOLUME',
	data: { trackId, volume }
})

export const changeSampleVolume = (trackId, volume) => dispatch => dispatch({
	type: 'SAMPLING_SET_TRACK_VOLUME',
	data: { trackId, volume }
})

export const changeSamplingStrategy = strategyId => dispatch => dispatch({
	type: 'SAMPLING_SET_STRATEGY',
	data: { strategyId }
})

export const changeSamplingTracks = (audios, tracks) => dispatch => dispatch({
	type: 'SAMPLING_SET_TRACKS',
	data: { audios, tracks }
})

export const changeSamplingTrackStatus = (trackId, playing) => dispatch => dispatch({
	type: 'SAMPLING_SET_TRACK_STATUS',
	data: { playing, trackId }
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
	if (audios.length > 0) {
		const indexMod = Math.abs(sampleIndex) % audios.length
		const audio = audios[indexMod]
		const track = tracks[indexMod]
		const volume2 = volume < 0 ? 0 : volume > 1 ? 1 : volume
		audio.volume = track.volume1 * volume2
		changeSampleVolume(track.id, volume2)
	}
}

export const startSample = sampleIndex => async (dispatch, getState) => {
	const { sampling } = getState()
	const { audios, tracks, sampleDuration } = sampling
	if (audios.length > 0) {
		const indexMod = Math.abs(sampleIndex) % audios.length
		const audio = audios[indexMod]
		const track = tracks[indexMod]
		if (!track.playing && audio.readyState) {
			audio.addEventListener('pause', () => dispatch(changeSamplingTrackStatus(track.id, false)))
			audio.currentTime = 0
			// audio.loop = true TODO as an option
			await audio.play()
			dispatch(changeSamplingTrackStatus(track.id, true))
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
	if (audios.length > 0) {
		const indexMod = Math.abs(sampleIndex) % audios.length
		const audio = audios[indexMod]
		const track = tracks[indexMod]
		if (track.playing)
			audio.pause()
	}
}