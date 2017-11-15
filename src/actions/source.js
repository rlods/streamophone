import { createProvider } from '../providers'
import { transformArray } from '../tools'
import { changeSampleAudioReady, changeSampleBPM, changeSampleNormalizationVolume, changeSamplingTracks } from './sampling'
//
import config from '../config'
import { createStrategy } from '../strategies'

// ------------------------------------------------------------------

export const changeSourceId = id => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_ID', id)
	return dispatch({
		type: 'SOURCE_SET_ID',
		data: { id }
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

export const normalizeAudio = (dispatch, audios, tracks, baseIndex, enrichedTracks) => {
	enrichedTracks.forEach((enrichedTrack, index) => {
		const sampleIndex = baseIndex + index
		const audio = audios[sampleIndex]
		const track = tracks[sampleIndex]
		if (enrichedTrack.gain) {
			let volume1 = 0.5 * Math.pow(10, ((-12 - enrichedTrack.gain) / 20))
			if (volume1 > 1.0) volume1 = 1.0
			audio.volume = volume1 * track.volume2
			dispatch(changeSampleNormalizationVolume(sampleIndex, volume1))
		}
		else {
			// console.log('NO GAIN ', track.id)
		}
	})
}

export const loadAudios = (dispatch, sampling, tracks) => tracks.map((track, sampleIndex) => {
	const audio = new Audio(track.preview)
	audio.volume = track.volume1 * track.volume2

	audio.addEventListener('loadeddata', () => {
		dispatch(changeSampleAudioReady(sampleIndex))
	})

	if (sampling.sampleDuration === 0) { // loop in full mode
		audio.loop = true 
	}

	return audio
})

// ------------------------------------------------------------------

const validateTrack = track => !!track.preview && track.readable // readable means the track is available in current country

export const play = history => async (dispatch, getState, { drivers }) => {
	try {
		const { sampling, source } = getState()

		history.replace(`/play?sampling_duration=${sampling.sampleDuration}&sampling_strategy=${sampling.strategyId}&sampling_transformation=${sampling.transformation}&source_id=${source.id}&source_type=${source.type}`)

		if (sampling.audios) {
			// Stop all previously loaded audios
			sampling.audios.forEach(audio => audio.pause())
		}
		
		// Create sampling midi strategy if specified
		const strategyDefinition = config.STRATEGIES[sampling.strategyId]
		const driver = drivers[strategyDefinition.driver]
		if (!driver)
			throw new Error(`Unknown driver "${strategyDefinition.driver}"`)

		driver.strategy = createStrategy(sampling.strategyId)

		// Fetch tracks

		const providerId = source.type.split('_')[0]
		const provider = createProvider(providerId)
		let tracks = await provider.fetchTracks(source.type, source.id)
		tracks = transformArray(tracks, driver.strategy.samplesCount, sampling.transformation, validateTrack)

		// Load audios
		const audios = loadAudios(dispatch, sampling, tracks)
		
		// Start enrichment if needed
		if (true) { // config.ENABLE_VOLUME_FROM_GAIN) {
			provider.enrichTracks(tracks, (baseIndex, enrichedTracks) => {
				console.log('Tracks have been enriched')

				// Update normalization volume
				normalizeAudio(dispatch, audios, tracks, baseIndex, enrichedTracks)

				// Update BPM
				enrichedTracks.forEach((enrichedTrack, index) => {
					const sampleIndex = baseIndex + index
					if (enrichedTrack.bpm) {
						dispatch(changeSampleBPM(sampleIndex, enrichedTrack.bpm))
					}
				})
			})
		}

		dispatch(changeSamplingTracks(audios, tracks))
	}
	catch (error) {
		console.log('Cannot load source', error)
	}
}
