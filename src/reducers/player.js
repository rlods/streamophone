
const INITIAL_STATE = {
	playing: false,
	tracks: null
}

// ------------------------------------------------------------------

const setSampleStatus = (state, { playing, sampleIndex }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, playing }) })

const setStatus = (state, { playing }) =>
	({ ...state, playing })

const setTracks = (state, { tracks }) =>
	({ ...state, tracks })

// ------------------------------------------------------------------

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'PLAYER_SET_SAMPLE_STATUS':
		return setSampleStatus(state, action.data)
	case 'PLAYER_SET_STATUS':
		return setStatus(state, action.data)
	case 'PLAYER_SET_TRACKS':
		return setTracks(state, action.data)
	default:
		return state
	}
}