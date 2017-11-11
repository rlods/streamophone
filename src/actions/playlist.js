import { chunkArray, fetchDeezerAPI, shuffleArray } from '../tools'
import ButtonsStrategy from '../midi/midiStrategy_Buttons'
import MultiSlidersStrategy from '../midi/midiStrategy_MultiSliders'
import SingleSliderStrategy from '../midi/midiStrategy_SingleSlider'

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
	return {
		audios,
		tracks
	}
}

export const loadPlaylist = () => async (dispatch, getState, midiController) => { 
	const state = getState()

	switch (state.sampling.samplerType)
	{
	case 'buttons':
		midiController.strategy = new ButtonsStrategy()
		break
	case 'singleslider':
		midiController.strategy = new SingleSliderStrategy()
		break
	case 'multisliders8':
		midiController.strategy = new MultiSlidersStrategy(state.sampling.count)
		break
	}

	const playlist = await fetchDeezerAPI(`playlist/${state.playlist.id}`)
	let audios = null, tracks = null
	if (ENABLE_VOLUME_FROM_GAIN) {
		const tracksIds = shuffleArray(playlist.tracks.data, state.sampling.count).map(track => track.id)
		const chunks = await Promise.all(chunkArray(tracksIds, DEEZER_API_SIMULTANEOUS_MAX_CALLS, loadTracks))
		audios = Array.prototype.concat.apply([], chunks.map(chunk => chunk.audios))
		tracks = Array.prototype.concat.apply([], chunks.map(chunk => chunk.tracks))
	}
	else {
		tracks = shuffleArray(playlist.tracks.data, state.sampling.count)
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
