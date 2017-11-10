
const INITIAL_STATE = {
	id: 0
}

const setPlaylist = (state, { id }) =>
	({ ...state, id })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'PLAYLIST_SET':
		return setPlaylist(state, action.data)
	default:
		return state
	}
}