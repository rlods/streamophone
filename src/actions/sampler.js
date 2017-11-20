import { createProvider } from '../providers'
import { createStrategy } from '../strategies'
import { displayMessage } from './messages'
import { transformArray } from '../tools'

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

const validateTrack = track => !!track.preview && track.readable // readable means the track is available in current country

export const loadSampler = () => async (dispatch, getState, { app }) => {
	const { sampler, source } = getState()
	try {
		// Stop previously loaded audios
		app.audioSampler.dispose()

		// Create strategy
		app.strategy = createStrategy(sampler.strategyId)

		// Create provider
		const providerId = source.type.split('_')[0]
		const provider = createProvider(providerId)

		// Fetch tracks
		let tracks = await provider.fetchTracks(source.type, source.id)
		tracks = transformArray(tracks, app.strategy.samplesCount, source.transformation, validateTrack)
		tracks.forEach(track => {
			track.loopStart = 0
			track.loopEnd = sampler.defaultDuration > 0 ? track.loopStart + (sampler.defaultDuration / 1000.0) : 0
			track.playing = false
			track.providerId = providerId
			track.ready = false
			track.speed = 1.0
			track.volume1 = 0.5
			track.volume2 = 1.0
		})

		// Load audios
		app.audioSampler.init(tracks)
		
		// Start enrichment
		provider.enrichTracks(tracks, (baseIndex, enrichedTracks) => {
			console.log(`${enrichedTracks.length} tracks have been enriched`)
			enrichedTracks.forEach((enrichedTrack, index) => {
				const sampleIndex = baseIndex + index

				// Update normalization volume
				if (enrichedTrack.gain) {
					let volume = 0.5 * Math.pow(10, ((-12 - enrichedTrack.gain) / 20))
					if (volume > 1.0) volume = 1.0
					dispatch(changeSamplerSampleNormalizationVolume(sampleIndex, volume))
				}

				// Update BPM
				if (enrichedTrack.bpm) {
					if (source.bpm > 0)
						dispatch(changeSamplerSampleSpeed(sampleIndex, source.bpm / enrichedTrack.bpm))
					dispatch(changeSamplerSampleBPM(sampleIndex, enrichedTrack.bpm))
				}
			})
		})

	}
	catch (error) {
		console.log('Cannot load sampler', error)
	}
}
