
const INITIAL_STATE = {
	audios: [],
	tracks: [],
	sampleDuration: 2000,
	strategyId: 'KEYBOARD_AZERTY'
}

const setTracks = (state, { audios, tracks }) =>
	({ ...state, audios, tracks })

const setTrackNormalizationVolume = (state, { trackId, volume }) =>
	({ ...state, tracks: state.tracks.map(other => other.id !== trackId ? other : { ...other, volume1: volume }) })

const setTrackVolume = (state, { trackId, volume }) =>
	({ ...state, tracks: state.tracks.map(other => other.id !== trackId ? other : { ...other, volume2: volume }) })

const setTrackStatus = (state, { playing, trackId }) =>
	({ ...state, tracks: state.tracks.map(other => other.id !== trackId ? other : { ...other, playing }) })

const setSampleDuration = (state, { sampleDuration }) =>
	({ ...state, sampleDuration })

const setSamplingStrategy = (state, { strategyId }) =>
	({ ...state, strategyId })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SAMPLING_SET_SAMPLE_DURATION':
		return setSampleDuration(state, action.data)
	case 'SAMPLING_SET_STRATEGY':
		return setSamplingStrategy(state, action.data)
	case 'SAMPLING_SET_TRACKS':
		return setTracks(state, action.data)
	case 'SAMPLING_SET_TRACK_NORMALIZATION_VOLUME':
		return setTrackNormalizationVolume(state, action.data)
	case 'SAMPLING_SET_TRACK_STATUS':
		return setTrackStatus(state, action.data)
	case 'SAMPLING_SET_TRACK_VOLUME':
		return setTrackVolume(state, action.data)
	default:
		return state
	}
}