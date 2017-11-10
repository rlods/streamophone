export const changeSampleCount = count => dispatch => dispatch({
	type: 'SAMPLING_SET_COUNT',
	data: {
		count
	}
})

export const changeSampleDuration = duration => dispatch => dispatch({
	type: 'SAMPLING_SET_DURATION',
	data: {
		duration
	}
})
