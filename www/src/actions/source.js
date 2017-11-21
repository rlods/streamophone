
export const changeSourceBPM = bpm => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_BPM', bpm)
	dispatch({
		type: 'SOURCE_SET_BPM',
		data: { bpm }
	})
}

export const changeSourceId = id => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_ID', id)
	dispatch({
		type: 'SOURCE_SET_ID',
		data: { id }
	})
}

export const changeSourceTransformation = transformation => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_TRANSFORMATION', transformation)
	dispatch({
		type: 'SOURCE_SET_TRANSFORMATION',
		data: { transformation }
	})
}

export const changeSourceType = type => dispatch => {
	sessionStorage.setItem('DEFAULT_SOURCE_TYPE', type)
	dispatch({
		type: 'SOURCE_SET_TYPE',
		data: { type }
	})
}
