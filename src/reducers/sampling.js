
const INITIAL_STATE = {
	count: 26
}

const setCount = (state, { count }) =>
	({ ...state, count })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SAMPLING_SET_COUNT':
		return setCount(state, action.data)
	default:
		return state
	}
}