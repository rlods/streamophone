import { fetchSourceData, fetchTrack } from '../providers/deezer'
import { transformArray } from '../tools'
import { changeSampleNormalizationVolume, changeSamplingTracks } from './sampling'
//
import config from '../config'
import { createStrategy } from '../strategies'

// ------------------------------------------------------------------

export const changeSourceData = data => dispatch => dispatch({
	type: 'SOURCE_SET_DATA',
	data: { data }
})

export const changeSourceId = id => dispatch => dispatch({
	type: 'SOURCE_SET_ID',
	data: { id }
})

export const changeSourceType = type => dispatch => dispatch({
	type: 'SOURCE_SET_TYPE',
	data: { type }
})

// ------------------------------------------------------------------

export const normalizeAudio = async (dispatch, track, audio) => {
	try {
		const augmentedTrack = await fetchTrack(track.id)
		let volume1 = !augmentedTrack.gain ? 0.5 : 0.5 * Math.pow(10, ((-12 - augmentedTrack.gain) / 20))
		if (volume1 > 1.0) volume1 = 1.0
		// console.log(`Normalized ${track.id}: ${track.volume1} -> ${volume1}`)
		audio.volume = volume1 * track.volume2
		dispatch(changeSampleNormalizationVolume(track.id, volume1))
	}
	catch (error) {
		console.log('Cannot normalize sample volume', error)
	}
}

export const loadAudios = (dispatch, sampling, tracks) => tracks.map(track => {
	const audio = new Audio(track.preview)
	audio.volume = track.volume1 * track.volume2

	// console.log('XXXX - Waiting', track.id)
	// audio.addEventListener('loadeddata', function() {
	// 	console.log('XXXX - Received', track.id, audio.readyState)
	// })

	if (sampling.sampleDuration === 0) { // loop in full mode
		audio.loop = true 
	}

	if (config.ENABLE_VOLUME_FROM_GAIN) {
		normalizeAudio(dispatch, track, audio)
	}

	return audio
})

// ------------------------------------------------------------------

const validateTrack = track => !!track.preview && track.readable // readable means the track is available in current country

export const loadSource = () => async (dispatch, getState, { drivers }) => {
	try {
		const { sampling, source } = getState()

		// Stop all previously loaded audios
		sampling.audios.forEach(audio => audio.pause())

		// Create sampling midi strategy if specified
		const strategyDefinition = config.STRATEGIES[sampling.strategyId]
		const driver = drivers[strategyDefinition.driver]
		if (!driver)
			throw new Error(`Unknown driver "${strategyDefinition.driver}"`)

		driver.strategy = createStrategy(sampling.strategyId)

		// Fetch tracks
		let tracks = await fetchSourceData(source.type, source.id)
		tracks = transformArray(tracks, driver.strategy.samplesCount, sampling.transformation, validateTrack)

		// Load audios
		const audios = loadAudios(dispatch, sampling, tracks)
		
		dispatch(changeSourceData(tracks))
		dispatch(changeSamplingTracks(audios, tracks))
	}
	catch (error) {
		console.log('Cannot load source', error)
	}
}
