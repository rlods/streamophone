
const INITIAL_STATE = {
	count: 26,
	audios: [],
	tracks: []
}

const setCount = (state, { count }) =>
	({ ...state, count })

const setTracks = (state, { audios, tracks }) =>
	({ ...state, audios, tracks })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SAMPLING_SET_COUNT':
		return setCount(state, action.data)
	case 'SAMPLING_SET_TRACKS':
		return setTracks(state, action.data)
	default:
		return state
	}
}