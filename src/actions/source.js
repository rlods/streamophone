import { createProvider } from '../providers'
import { transformArray } from '../tools'
import { changeSampleBPM, changeSampleSpeed, changeSampleNormalizationVolume, changeSamples } from './sampling'
import { createStrategy } from '../strategies'
import config from '../config'

// ------------------------------------------------------------------

export const changeSourceBPM = bpm => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_BPM', bpm)
	return dispatch({
		type: 'SOURCE_SET_BPM',
		data: { bpm }
	})
}

export const changeSourceId = id => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_ID', id)
	return dispatch({
		type: 'SOURCE_SET_ID',
		data: { id }
	})
}

export const changeSourceTransformation = transformation => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_TRANSFORMATION', transformation)
	dispatch({
		type: 'SOURCE_SET_TRANSFORMATION',
		data: { transformation }
	})
}

export const changeSourceType = type => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_TYPE', type)
	return dispatch({
		type: 'SOURCE_SET_TYPE',
		data: { type }
	})
}

// ------------------------------------------------------------------

const validateTrack = track => !!track.preview && track.readable // readable means the track is available in current country

export const goToSampling = history => async (dispatch, getState, { app }) => {
	const { sampling, source } = getState()
	history.push(`/create?sampling_duration=${sampling.defaultDuration}&sampling_strategy=${sampling.strategyId}&source_bpm=${source.bpm}&source_id=${source.id}&source_transformation=${source.transformation}&source_type=${source.type}`)
	dispatch(changeSamples(null)) // TODO: we should stop loading tracks (for ex soundcloud tracks are slow to download)
}

export const createSampling = () => async (dispatch, getState, { app }) => {
	const { sampling, source } = getState()
	try {
		// Stop all previously loaded audios
		app.audioEngine.stopAll()

		// Create sampling midi strategy if specified
		const strategyDefinition = config.STRATEGIES[sampling.strategyId]
		const driver = app.drivers[strategyDefinition.driver]
		if (!driver)
			throw new Error(`Unknown driver "${strategyDefinition.driver}"`)

		app.strategy = createStrategy(sampling.strategyId)

		// Fetch tracks

		const providerId = source.type.split('_')[0]
		const provider = createProvider(providerId)
		let tracks = await provider.fetchTracks(source.type, source.id)
		tracks.forEach(track => {
			track.loopStart = 0
			track.loopEnd = sampling.defaultDuration > 0 ? track.loopStart + (sampling.defaultDuration / 1000.0) : 0
			track.playing = false
			track.ready = false
			track.speed = 1.0
			track.volume1 = 0.5
			track.volume2 = 1.0
		})
		tracks = transformArray(tracks, app.strategy.samplesCount, source.transformation, validateTrack)

		// Load audios
		app.audioEngine.loadAudios(dispatch, tracks)
		
		// Start enrichment
		provider.enrichTracks(tracks, (baseIndex, enrichedTracks) => {
			console.log(`${enrichedTracks.length} tracks have been enriched`)

			// Update normalization volume
			enrichedTracks.forEach((enrichedTrack, index) => {
				const sampleIndex = baseIndex + index
				if (enrichedTrack.gain) {
					let volume = 0.5 * Math.pow(10, ((-12 - enrichedTrack.gain) / 20))
					if (volume > 1.0) volume = 1.0
					dispatch(changeSampleNormalizationVolume(sampleIndex, volume))
				}
			})

			// Update BPM
			enrichedTracks.forEach((enrichedTrack, index) => {
				const sampleIndex = baseIndex + index
				if (enrichedTrack.bpm) {
					if (source.bpm > 0)
						dispatch(changeSampleSpeed(sampleIndex, source.bpm / enrichedTrack.bpm))
					dispatch(changeSampleBPM(sampleIndex, enrichedTrack.bpm))
				}
			})
		})

		dispatch(changeSamples(tracks))
	}
	catch (error) {
		console.log('Cannot load source', error)
	}
}
