import config from '../config'
import { getSearchParam } from '../tools'

// ------------------------------------------------------------------

const INITIAL_STATE = {
	id: getSearchParam('source_id') || sessionStorage.getItem('DEFAULT_SOURCE_ID') || config.DEFAULT.SOURCE_ID,
	transformation: getSearchParam('source_transformation') || sessionStorage.getItem('DEFAULT_SOURCE_TRANSFORMATION') || config.DEFAULT.SOURCE_TRANSFORMATION,
	type: getSearchParam('source_type') || sessionStorage.getItem('DEFAULT_SOURCE_TYPE') || config.DEFAULT.SOURCE_TYPE
}

// ------------------------------------------------------------------

const setSourceId = (state, { id }) =>
	({ ...state, id })

const setSourceTransformation = (state, { transformation }) =>
	({ ...state, transformation })

const setSourceType = (state, { type }) =>
	({ ...state, type })

// ------------------------------------------------------------------

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SOURCE_SET_ID':
		return setSourceId(state, action.data)
	case 'SOURCE_SET_TRANSFORMATION':
		return setSourceTransformation(state, action.data)
	case 'SOURCE_SET_TYPE':
		return setSourceType(state, action.data)
	default:
		return state
	}
}