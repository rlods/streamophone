
const INITIAL_STATE = {
	id: '1083902971',
	data: null,
	type: 'playlist'
}

const setSourceData = (state, { data }) =>
	({ ...state, data })

const setSourceId = (state, { id }) =>
	({ ...state, id })

const setSourceType = (state, { type }) =>
	({ ...state, type })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SOURCE_SET_DATA':
		return setSourceData(state, action.data)
	case 'SOURCE_SET_ID':
		return setSourceId(state, action.data)
	case 'SOURCE_SET_TYPE':
		return setSourceType(state, action.data)
	default:
		return state
	}
}