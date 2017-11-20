import { displayMessage } from './messages'

// ------------------------------------------------------------------

const KEY_SPACE = 32

// ------------------------------------------------------------------

export const changeSamplerDefaultDuration = defaultDuration => dispatch => {
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

export const changeSamplerSamples = tracks => dispatch => {
	dispatch({
		type: 'SAMPLER_SET_SAMPLES',
		data: { tracks }
	})
}

export const changeSamplerStatus = started => dispatch => {
	dispatch({
		type: 'SAMPLER_SET_STATUS',
		data: { started }
	})
}

// ------------------------------------------------------------------

export const changeSamplerSampleReady = sampleIndex => dispatch => {
	dispatch({
		type: 'SAMPLER_SET_SAMPLE_READY',
		data: { sampleIndex }
	})
}

export const changeSamplerSampleBPM = (sampleIndex, bpm) => dispatch => {
	dispatch({
		type: 'SAMPLER_SET_SAMPLE_BPM',
		data: { sampleIndex, bpm }
	})
}

export const changeSamplerSampleNormalizationVolume = (sampleIndex, volume) => (dispatch, getState, { app }) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio) {
		audio.setVolume(volume * getState().sampler.tracks[sampleIndex].volume2)
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_NORMALIZATION_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSamplerSampleSpeed = (sampleIndex, speed) => (dispatch, getState, { app }) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio) {
		audio.setSpeed(speed)
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_SPEED',
			data: { sampleIndex, speed }
		})
	}
}

export const changeSamplerSampleVolume = (sampleIndex, volume) => (dispatch, getState, { app }) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio) {
		audio.setVolume(getState().sampler.tracks[sampleIndex].volume1 * volume)
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSamplerSampleStatus = (sampleIndex, playing) => (dispatch, getState) => {
	if (!getState().sampler.started) {
		dispatch(displayMessage('info', 'Press SPACE to listen and share!'))
		dispatch(changeSamplerStatus(true))
	}
	dispatch({
		type: 'SAMPLER_SET_SAMPLE_STATUS',
		data: { playing, sampleIndex }
	})
}

// --------------------------------------------------------------

export const handleKeyDown = keyCode => async (dispatch, getState, { app }) => {
	if (keyCode === KEY_SPACE)
		app.audioSampler.getRecorder().snapshot()
	else
		app.audioSampler.handleKeyDown(keyCode)
}

export const handleKeyUp = keyCode => (dispatch, getState, { app }) => {
	app.audioSampler.handleKeyUp(keyCode)
}

export const handleMidiEvent = (channel, key, velocity) => (dispatch, getState, { app }) => {
	app.audioSampler.handleMidiEvent(channel, key, velocity)
}

export const handleSocketEvent = message => (dispatch, getState, { app }) => {
	app.audioSampler.handleSocketMessage(message)
}

// --------------------------------------------------------------

export const registerSampleCanvas = (sampleIndex, canvas) => (dispatch, getState, { app }) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio)
		audio.attachCanvas(canvas)
}

export const startSample = sampleIndex => async (dispatch, getState, { app }) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio)
		audio.start()
}

export const stopSample = sampleIndex => async (dispatch, getState, { app }) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio)
		audio.stop()
}

export const goToSampler = history => async (dispatch, getState, { app }) => {
	const { sampler, source } = getState()
	history.push(`make?sampler_duration=${sampler.defaultDuration}&sampler_strategy=${sampler.strategyId}&source_bpm=${source.bpm}&source_id=${source.id}&source_transformation=${source.transformation}&source_type=${source.type}`)
	dispatch(changeSamplerSamples(null)) // TODO: we should stop loading tracks (for ex soundcloud tracks are slow to download)
}

// --------------------------------------------------------------

export const loadSampler = () => async (dispatch, getState, { app }) => {
	const { sampler, source } = getState()
	try {
		app.audioSampler.dispose()
		await app.audioSampler.init(
			sampler.strategyId,
			sampler.defaultDuration,
			source.bpm,
			source.id,
			source.type.split('_')[0],
			source.transformation,
			source.type)
	}
	catch (error) {
		console.log('Cannot load sampler', error)
	}
}
