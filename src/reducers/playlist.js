
const INITIAL_STATE = {
	id: 1083902971,
	data: null
}

const setId = (state, { id }) =>
	({ ...state, id, data: null })

const setData = (state, { playlist }) =>
	({ ...state, data: playlist })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'PLAYLIST_SET_ID':
		return setId(state, action.data)
	case 'PLAYLIST_SET_DATA':
		return setData(state, action.data)
	default:
		return state
	}
}