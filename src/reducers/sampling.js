
const INITIAL_STATE = {
	count: 26,
	duration: 2000
}

const setCount = (state, { count }) =>
	({ ...state, count })

const setDuration = (state, { duration }) =>
	({ ...state, duration })

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SAMPLING_SET_COUNT':
		return setCount(state, action.data)
	case 'SAMPLING_SET_DURATION':
		return setDuration(state, action.data)
	default:
		return state
	}
}