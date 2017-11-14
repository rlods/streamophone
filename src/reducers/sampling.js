
const INITIAL_STATE = {
	audios: null,
	tracks: null,
	sampleDuration: 0, // full by default
	strategyId: 'KEYBOARD_AZERTY',
	transformation: 'shuffle'
}

const setTracks = (state, { audios, tracks }) =>
	({ ...state, audios, tracks })

const setTrackNormalizationVolume = (state, { trackId, volume }) =>
	({ ...state, tracks: state.tracks.map(other => other.id !== trackId ? other : { ...other, volume1: volume }) })

const setSampleVolume = (state, { sampleIndex, volume }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, volume2: volume }) })

const setSampleStatus = (state, { playing, sampleIndex }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, playing }) })

const setSampleDuration = (state, { sampleDuration }) =>
	({ ...state, sampleDuration })

const setSamplingStrategy = (state, { strategyId }) =>
	({ ...state, strategyId })

const setSamplingTransformation = (state, { transformation }) =>
	({ ...state, transformation })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SAMPLING_SET_SAMPLE_DURATION':
		return setSampleDuration(state, action.data)
	case 'SAMPLING_SET_STRATEGY':
		return setSamplingStrategy(state, action.data)
	case 'SAMPLING_SET_TRANSFORMATION':
		return setSamplingTransformation(state, action.data)
	case 'SAMPLING_SET_TRACKS':
		return setTracks(state, action.data)
	case 'SAMPLING_SET_TRACK_NORMALIZATION_VOLUME':
		return setTrackNormalizationVolume(state, action.data)
	case 'SAMPLING_SET_SAMPLE_STATUS':
		return setSampleStatus(state, action.data)
	case 'SAMPLING_SET_SAMPLE_VOLUME':
		return setSampleVolume(state, action.data)
	default:
		return state
	}
}