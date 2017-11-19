
const INITIAL_STATE = {
	tracks: null
}

// ------------------------------------------------------------------

const setTracks = (state, { tracks }) =>
	({ ...state, tracks })

// ------------------------------------------------------------------

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'PLAYER_SET_TRACKS':
		return setTracks(state, action.data)
	default:
		return state
	}
}