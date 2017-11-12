import { fetchPlaylist, fetchTrack } from '../providers/deezer'
import { shuffleArray } from '../tools'
import { changeSampleNormalizationVolume } from './sampling'
//
import KeyboardBasicStrategy from '../strategies/KeyboardBasicStrategy'
import ButtonsStrategy from '../strategies/midiStrategy_Buttons'
import CustomSocketStrategy from '../strategies/CustomSocketStrategy'
import MultiSlidersStrategy from '../strategies/midiStrategy_MultiSliders'
import SingleSliderStrategy from '../strategies/midiStrategy_SingleSlider'
import LightPadBlockStrategy from '../strategies/midiStrategy_LightPadBlock'
import KeyboardStrategy from '../strategies/midiStrategy_Keyboard'
import config from '../config'

// ------------------------------------------------------------------

export const changePlaylistId = id => dispatch => dispatch({
	type: 'PLAYLIST_SET_ID',
	data: {
		id
	}
})

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

export const loadAudios = (dispatch, state, tracks) => tracks.map(track => {
	const audio = new Audio(track.preview)
	track.volume1 = 0.5
	track.volume2 = 1.0
	audio.volume = track.volume1 * track.volume2

	if (state.sampling.sampleDuration === 0) { // loop in full mode
		audio.loop = true 
	}

	if (config.ENABLE_VOLUME_FROM_GAIN)
		normalizeAudio(dispatch, track, audio)

	return audio
})

export const validateTrack = track => !!track.preview

export const loadPlaylist = () => async (dispatch, getState, { drivers }) => { 
	try {
		const state = getState()

		// Stop all previously loaded audios
		state.sampling.audios.forEach(audio => audio.pause())

		// Create sampling midi strategy if specified
		const strategyDefinition = config.STRATEGIES[state.sampling.strategyId]
		const driver = drivers[strategyDefinition.driver]
		if (!driver)
			throw new Error(`Unknown driver "${strategyDefinition.driver}"`)

		switch (state.sampling.strategyId)
		{
		case 'KEYBOARD_AZERTY':
			driver.strategy = new KeyboardBasicStrategy()
			break
		case 'BCF2000_BUTTONS':
			driver.strategy = new ButtonsStrategy()
			break
		case 'BCF2000_SINGLESLIDER':
			driver.strategy = new SingleSliderStrategy()
			break
		case 'BCF2000_MULTISLIDERS':
			driver.strategy = new MultiSlidersStrategy(8, 128)
			break
		case 'LIGHTPADBLOCK_16':
			driver.strategy = new LightPadBlockStrategy()
			break
		case 'CUSTOM_SOCKET_STRATEGY':
			driver.strategy = new CustomSocketStrategy()
			break
		case 'KEYBOARD_24':
			driver.strategy = new KeyboardStrategy()
			break
		default:
			throw new Error(`Unknown strategy "${state.sampling.strategyId}"`)
		}

		// Fetch playlist tracks data
		const playlist = await fetchPlaylist(state.playlist.id)
		const tracks = shuffleArray(playlist.tracks.data, driver.strategy.samplesCount, validateTrack)
		const audios = loadAudios(dispatch, state, tracks)

		dispatch({
			type: 'PLAYLIST_SET_DATA',
			data: {
				playlist
			}
		})
		
		dispatch({
			type: 'SAMPLING_SET_TRACKS',
			data: {
				audios,
				tracks
			}
		})
	}
	catch (error) {
		console.log('Cannot load playlist', error)
	}
}
