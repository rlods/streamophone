
const INITIAL_STATE = {
	count: 26,
	audios: [],
	tracks: [],
	samplerType: 'multisliders_8_columns'
}

const setCount = (state, { count }) =>
	({ ...state, count })

const setTracks = (state, { audios, tracks }) =>
	({ ...state, audios, tracks })

const setTrackStatus = (state, { playing, trackId }) =>
	({ ...state, tracks: state.tracks.map(other => other.id !== trackId ? other : { ...other, playing }) })

const setSamplerType = (state, { samplerType }) =>
	({ ...state, samplerType })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SAMPLING_SET_COUNT':
		return setCount(state, action.data)
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