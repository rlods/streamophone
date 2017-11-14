import config from '../config'

const INITIAL_STATE = {
	id: config.DEFAULT.SOURCE_ID,
	type: config.DEFAULT.SOURCE_TYPE
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