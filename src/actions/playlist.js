import { fetchDeezerAPI, shuffleArray } from '../tools'
import { StrategyTypes } from '../midi/midiStrategy'
//
import BasicStrategy from '../midi/midiStrategy'
import ButtonsStrategy from '../midi/midiStrategy_Buttons'
import MultiSlidersStrategy from '../midi/midiStrategy_MultiSliders'
import SingleSliderStrategy from '../midi/midiStrategy_SingleSlider'
import LightPadBlockStrategy from '../midi/midiStrategy_LightPadBlock'

// ------------------------------------------------------------------

const ENABLE_VOLUME_FROM_GAIN = false

// ------------------------------------------------------------------

export const changePlaylistId = id => dispatch => dispatch({
	type: 'PLAYLIST_SET_ID',
	data: {
		id
	}
})

export const loadAudios = tracks => tracks.map(track => {
	track.volume1 = 0.5
	track.volume2 = 1.0
	const audio = new Audio(track.preview)
	audio.volume = track.volume1 * track.volume2
	return audio
})

export const normalizeTracks = (tracks, audios) => {
	tracks.forEach(async (track, index) => {
		const audio = audios[index]
		const augmentedTrack = await fetchDeezerAPI(`track/${track.id}`)
		let volume = !augmentedTrack.gain ? 0.5 : 0.5 * Math.pow(10, ((-12 - augmentedTrack.gain) / 20))
		if (volume > 1.0) volume = 1.0
		console.log('Normalized Volume:', volume) // TODO: apply on audio
	})
}

export const validateTrack = track => !!track.preview

export const loadPlaylist = () => async (dispatch, getState, midiController) => { 
	const state = getState()

	// Stop all previously loaded audios
	state.sampling.audios.forEach(audio => audio.pause())

	// Create sampling midi strategy if specified
	let samplingCount = 0
	switch (state.sampling.samplerType)
	{
	case StrategyTypes.KEYBOARD_AZERTY:
		samplingCount = 26
		midiController.strategy = new BasicStrategy()
		break
	case StrategyTypes.BCF2000_BUTTONS_32.id:
		samplingCount = 32
		midiController.strategy = new ButtonsStrategy()
		break
	case StrategyTypes.BCF2000_BUTTONS_64.id:
		samplingCount = 64
		midiController.strategy = new ButtonsStrategy()
		break
	case StrategyTypes.BCF2000_SINGLESLIDER_32.id:
		samplingCount = 32
		midiController.strategy = new SingleSliderStrategy()
		break
	case StrategyTypes.BCF2000_SINGLESLIDER_64.id:
		samplingCount = 64
		midiController.strategy = new SingleSliderStrategy()
		break
	case StrategyTypes.BCF2000_MULTISLIDERS_8_32.id:
		samplingCount = 32
		midiController.strategy = new MultiSlidersStrategy(8, 128, samplingCount)
		break
	case StrategyTypes.BCF2000_MULTISLIDERS_8_64.id:
		samplingCount = 64
		midiController.strategy = new MultiSlidersStrategy(8, 128, samplingCount)
		break
	case StrategyTypes.LIGHTPADBLOCK_32.id:
		samplingCount = 32
		midiController.strategy = new LightPadBlockStrategy()
		break
	default:
		samplingCount = 26
		midiController.strategy = new BasicStrategy()
		break
	}

	// Fetch playlist tracks data
	const playlist = await fetchDeezerAPI(`playlist/${state.playlist.id}`)
	const tracks = shuffleArray(playlist.tracks.data, samplingCount, validateTrack)
	const audios = loadAudios(tracks)

	if (ENABLE_VOLUME_FROM_GAIN)
		normalizeTracks(tracks, audios)

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
