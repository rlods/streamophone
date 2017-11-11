
const INITIAL_STATE = {
	audios: [],
	tracks: [],
	sampleDuration: 2000, // full sample is played
	samplerType: 'KEYBOARD_AZERTY'
}

const setTracks = (state, { audios, tracks }) =>
	({ ...state, audios, tracks })

const setTrackStatus = (state, { playing, trackId }) =>
	({ ...state, tracks: state.tracks.map(other => other.id !== trackId ? other : { ...other, playing }) })

const setSampleDuration = (state, { sampleDuration }) =>
	({ ...state, sampleDuration })

const setSamplerType = (state, { samplerType }) =>
	({ ...state, samplerType })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SAMPLING_SET_SAMPLE_DURATION':
		return setSampleDuration(state, action.data)
	case 'SAMPLING_SET_SAMPLER_TYPE':
		return setSamplerType(state, action.data)
	case 'SAMPLING_SET_TRACKS':
		return setTracks(state, action.data)
	case 'SAMPLING_SET_TRACK_STATUS':
		return setTrackStatus(state, action.data)
	default:
		return state
	}
}