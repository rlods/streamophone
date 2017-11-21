
const INITIAL_STATE = []

// ------------------------------------------------------------------

const addMessage = (state, { message }) => 
	[ message, ...state ] // we add the new message at the beginning

const removeMessage = (state, { id }) =>
	state.filter(message => message.id !== id)

// ------------------------------------------------------------------

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'MESSAGE_ADD':
		return addMessage(state, action.data)
	case 'MESSAGE_REMOVE':
		return removeMessage(state, action.data)
	default:
		return state
	}
}
