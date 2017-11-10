
const INITIAL_STATE = {
	id: 1083902971,
	audios: [],
	tracks: [],
	loaded: false
}

const setId = (state, { id }) =>
	({ ...state, id, loaded: false, audios: [], tracks: [] })

const setTracks = (state, { audios, tracks }) =>
	({ ...state, loaded: true, audios, tracks })

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