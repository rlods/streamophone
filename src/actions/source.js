import { createProvider } from '../providers'
import { transformArray } from '../tools'
import { changeSampleAudioReady, changeSampleBPM, changeSampleSpeed, changeSampleNormalizationVolume, changeSampleStatus, changeSamplingTracks } from './sampling'
//
import config from '../config'
import { createStrategy } from '../strategies'
import CustomAudio from '../tools/CustomAudio'

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

export const normalizeAudio = (dispatch, audios, tracks, baseIndex, enrichedTracks) => {
	enrichedTracks.forEach((enrichedTrack, index) => {
		const sampleIndex = baseIndex + index
		if (enrichedTrack.gain) {
			let volume = 0.5 * Math.pow(10, ((-12 - enrichedTrack.gain) / 20))
			if (volume > 1.0) volume = 1.0
			dispatch(changeSampleNormalizationVolume(sampleIndex, volume))
		}
		else {
			// console.log('NO GAIN ', track.id)
		}
	})
}

export const loadAudios = (dispatch, sampling, tracks) => tracks.map((track, sampleIndex) => {
	const audio = new CustomAudio(track.preview, () => dispatch(changeSampleStatus(sampleIndex, true)), () => dispatch(changeSampleStatus(sampleIndex, false)))
	audio.setLoop(sampling.duration)
	audio.setVolume(track.volume1 * track.volume2)
	audio.init().then(() => dispatch(changeSampleAudioReady(sampleIndex)))
	return audio
})

// ------------------------------------------------------------------

const validateTrack = track => !!track.preview && track.readable // readable means the track is available in current country

export const play = history => async (dispatch, getState, { drivers }) => {
	try {
		const { sampling, source } = getState()

		history.replace(`/play?sampling_duration=${sampling.duration}&sampling_strategy=${sampling.strategyId}&source_bpm=${source.bpm}&source_id=${source.id}&source_transformation=${source.transformation}&source_type=${source.type}`)

		if (sampling.audios) {
			// Stop all previously loaded audios
			sampling.audios.forEach(audio => audio.stop())
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
		tracks = transformArray(tracks, driver.strategy.samplesCount, source.transformation, validateTrack)

		// Load audios
		const audios = loadAudios(dispatch, sampling, tracks)
		
		// Start enrichment if needed
		if (true) { // config.ENABLE_VOLUME_FROM_GAIN) {
			provider.enrichTracks(tracks, (baseIndex, enrichedTracks) => {
				// console.log('Tracks have been enriched')

				// Update normalization volume
				normalizeAudio(dispatch, audios, tracks, baseIndex, enrichedTracks)

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
		}

		dispatch(changeSamplingTracks(audios, tracks))
	}
	catch (error) {
		console.log('Cannot load source', error)
	}
}
