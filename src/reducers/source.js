
const INITIAL_STATE = {
	id: '1083902971',
	type: 'playlist'
}

const setSourceId = (state, { id }) =>
	({ ...state, id })

const setSourceType = (state, { type }) =>
	({ ...state, type })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SOURCE_SET_ID':
		return setSourceId(state, action.data)
	case 'SOURCE_SET_TYPE':
		return setSourceType(state, action.data)
	default:
		return state
	}
}