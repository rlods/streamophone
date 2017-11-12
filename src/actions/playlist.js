import { fetchDeezerAPI, shuffleArray } from '../tools'
import StrategyDefinitions from '../controllers/strategies/StrategyDefinitions'
import { changeSampleNormalizationVolume } from './sampling'
//
import ButtonsStrategy from '../controllers/strategies/midiStrategy_Buttons'
import CustomSocketStrategy from '../controllers/strategies/CustomSocketStrategy'
import MultiSlidersStrategy from '../controllers/strategies/midiStrategy_MultiSliders'
import SingleSliderStrategy from '../controllers/strategies/midiStrategy_SingleSlider'
import LightPadBlockStrategy from '../controllers/strategies/midiStrategy_LightPadBlock'
import KeyboardStrategy from '../controllers/strategies/midiStrategy_Keyboard'
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
		const augmentedTrack = await fetchDeezerAPI(`track/${track.id}`)
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

export const loadAudios = (dispatch, tracks) => tracks.map(track => {
	const audio = new Audio(track.preview)
	track.volume1 = 0.5
	track.volume2 = 1.0
	audio.volume = track.volume1 * track.volume2

	if (config.ENABLE_VOLUME_FROM_GAIN)
		normalizeAudio(dispatch, track, audio)

	return audio
})

export const validateTrack = track => !!track.preview

export const loadPlaylist = () => async (dispatch, getState, { midiController, socketController }) => { 
	try {
		const state = getState()

		// Stop all previously loaded audios
		state.sampling.audios.forEach(audio => audio.pause())

		// Create sampling midi strategy if specified
		let samplingCount = 0
		const strategyDefinition = StrategyDefinitions[state.sampling.strategyId]
		switch (state.sampling.strategyId)
		{
		case 'BCF2000_BUTTONS':
			midiController.strategy = new ButtonsStrategy()
			break
		case 'BCF2000_SINGLESLIDER':
			midiController.strategy = new SingleSliderStrategy()
			break
		case 'BCF2000_MULTISLIDERS_8_32':
			midiController.strategy = new MultiSlidersStrategy(8, 128, samplingCount)
			break
		case 'BCF2000_MULTISLIDERS_8_64':
			midiController.strategy = new MultiSlidersStrategy(8, 128, samplingCount)
			break
		case 'LIGHTPADBLOCK_16':
			midiController.strategy = new LightPadBlockStrategy()
			break
		case 'CUSTOM_SOCKET_STRATEGY':
			socketController.strategy = new CustomSocketStrategy()
			break
		case 'KEYBOARD_24':
			midiController.strategy = new KeyboardStrategy()
			break
		default:
			break
		}

		// Fetch playlist tracks data
		const playlist = await fetchDeezerAPI(`playlist/${state.playlist.id}`)
		const tracks = shuffleArray(playlist.tracks.data, strategyDefinition.samplingCount, validateTrack)
		const audios = loadAudios(dispatch, tracks)

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
