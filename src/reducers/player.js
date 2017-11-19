
const INITIAL_STATE = {
	record: null
}

// ------------------------------------------------------------------

const setRecord = (state, { record }) =>
	({ ...state, record })

// ------------------------------------------------------------------

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'PLAYER_SET_RECORD':
		return setRecord(state, action.data)
	default:
		return state
	}
}