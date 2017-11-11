import { chunkArray, fetchDeezerAPI, shuffleArray } from '../tools'
import { StrategyTypes } from '../midi/midiStrategy'
//
import BasicStrategy from '../midi/midiStrategy'
import ButtonsStrategy from '../midi/midiStrategy_Buttons'
import MultiSlidersStrategy from '../midi/midiStrategy_MultiSliders'
import SingleSliderStrategy from '../midi/midiStrategy_SingleSlider'
import LightPadBlockStrategy from '../midi/midiStrategy_LightPadBlock'

// ------------------------------------------------------------------

const DEEZER_API_SIMULTANEOUS_MAX_CALLS = 15
const ENABLE_VOLUME_FROM_GAIN = false

// ------------------------------------------------------------------

export const changePlaylistId = id => dispatch => dispatch({
	type: 'PLAYLIST_SET_ID',
	data: {
		id
	}
})

export const loadAudios = tracks => tracks.map(track => {
	// We test if gain is available on track but sadly it's only available when getting the track data individually
	track.volume1 = !track.gain ? 0.5 : 0.5 * Math.pow(10, ((-12 - track.gain) / 20))
	if (track.volume1 > 1.0) track.volume1 = 1.0
	track.volume2 = 1.0
	const audio = new Audio(track.preview)
	audio.volume = track.volume1 * track.volume2
	return audio
})

export const loadTracks = async tracksIds => {
	const tracks = await Promise.all(tracksIds.map(async trackId => fetchDeezerAPI(`track/${trackId}`)))
	const audios = loadAudios(tracks)
	return { audios, tracks }
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
		samplingCount = 32
		midiController.strategy = new BasicStrategy()
		break
	}

	// Fetch playlist tracks data
	const playlist = await fetchDeezerAPI(`playlist/${state.playlist.id}`)
	let audios = null, tracks = null
	if (ENABLE_VOLUME_FROM_GAIN) {
		// It's really cool but we should not rely on it since it requires to request the API for each track
		const tracksIds = shuffleArray(playlist.tracks.data, samplingCount, validateTrack).map(track => track.id)
		const chunks = await Promise.all(chunkArray(tracksIds, DEEZER_API_SIMULTANEOUS_MAX_CALLS, loadTracks))
		audios = Array.prototype.concat.apply([], chunks.map(chunk => chunk.audios))
		tracks = Array.prototype.concat.apply([], chunks.map(chunk => chunk.tracks))
	}
	else {
		tracks = shuffleArray(playlist.tracks.data, samplingCount, validateTrack)
		audios = loadAudios(tracks)
	}

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
