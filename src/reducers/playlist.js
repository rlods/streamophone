
const INITIAL_STATE = {
	id: 1083902971,
	tracks: []
}

const setId = (state, { id }) =>
	({ ...state, id })

const setTracks = (state, { tracks }) =>
	({ ...state, tracks })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'PLAYLIST_SET_ID':
		return setId(state, action.data)
	case 'PLAYLIST_SET_TRACKS':
		return setTracks(state, action.data)
	default:
		return state
	}
}