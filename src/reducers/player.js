
const INITIAL_STATE = {
	playing: false,
	tracks: null
}

// ------------------------------------------------------------------

const setSampleReady = (state, { sampleIndex }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, ready: true }) })

const setSampleStatus = (state, { playing, sampleIndex }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, playing }) })

const setSamples = (state, { tracks }) =>
	({ ...state, tracks })

const setStatus = (state, { playing }) =>
	({ ...state, playing })

// ------------------------------------------------------------------

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'PLAYER_SET_SAMPLE_READY':
		return setSampleReady(state, action.data)
	case 'PLAYER_SET_SAMPLE_STATUS':
		return setSampleStatus(state, action.data)
	case 'PLAYER_SET_SAMPLES':
		return setSamples(state, action.data)
	case 'PLAYER_SET_STATUS':
		return setStatus(state, action.data)
	default:
		return state
	}
}