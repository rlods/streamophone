
let MESSAGE_ID_GENERATOR = 0

export const removeMessage = id => ({
	type: 'MESSAGE_REMOVE',
	data: { id }
})

export const displayMessage = (type, text, duration=5000) => (dispatch, getState) => {
	const id = MESSAGE_ID_GENERATOR++
	dispatch ({
		type: 'MESSAGE_ADD',
		data: { message: { id, text, type } }
	})
	setTimeout(() => {
		dispatch(removeMessage(id))
	}, duration)
}

export const displayError = (text, duration=5000) => displayMessage('error', text, duration)
