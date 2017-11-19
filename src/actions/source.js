import { changeSampleBPM, changeSampleSpeed, changeSampleNormalizationVolume, changeSamples } from './sampler'
import { createProvider } from '../providers'
import { createStrategy } from '../strategies'
import { transformArray } from '../tools'

// ------------------------------------------------------------------

export const changeSourceBPM = bpm => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_BPM', bpm)
	dispatch({
		type: 'SOURCE_SET_BPM',
		data: { bpm }
	})
}

export const changeSourceId = id => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_ID', id)
	dispatch({
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
	dispatch({
		type: 'SOURCE_SET_TYPE',
		data: { type }
	})
}

// ------------------------------------------------------------------

const validateTrack = track => !!track.preview && track.readable // readable means the track is available in current country

export const goToSampler = history => async (dispatch, getState, { app }) => {
	const { sampler, source } = getState()
	history.push(`/create?sampler_duration=${sampler.defaultDuration}&sampler_strategy=${sampler.strategyId}&source_bpm=${source.bpm}&source_id=${source.id}&source_transformation=${source.transformation}&source_type=${source.type}`)
	dispatch(changeSamples(null)) // TODO: we should stop loading tracks (for ex soundcloud tracks are slow to download)
}

export const createSampler = () => async (dispatch, getState, { app }) => {
	const { sampler, source } = getState()
	try {
		// Stop all previously loaded audios
		app.audioEngine.stopAll()

		// Create strategy
		app.strategy = createStrategy(sampler.strategyId)

		// Fetch tracks
		const providerId = source.type.split('_')[0]
		const provider = createProvider(providerId)
		const tracks = transformArray(await provider.fetchTracks(source.type, source.id), app.strategy.samplesCount, source.transformation, validateTrack)
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

		// Load audios (asynchronously)
		/* await */ app.audioEngine.loadAudios(dispatch, tracks)
		
		// Start enrichment
		provider.enrichTracks(tracks, (baseIndex, enrichedTracks) => {
			console.log(`${enrichedTracks.length} tracks have been enriched`)
			enrichedTracks.forEach((enrichedTrack, index) => {
				const sampleIndex = baseIndex + index

				// Update normalization volume
				if (enrichedTrack.gain) {
					let volume = 0.5 * Math.pow(10, ((-12 - enrichedTrack.gain) / 20))
					if (volume > 1.0) volume = 1.0
					dispatch(changeSampleNormalizationVolume(sampleIndex, volume))
				}

				// Update BPM
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
