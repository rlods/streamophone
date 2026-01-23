import type { Reducer } from 'redux'
import type { MessagesState, Message, AppAction } from '../types'

// ------------------------------------------------------------------

// Action data types for message actions
interface AddMessageData {
	message: Message
}

interface RemoveMessageData {
	id: number
}

// ------------------------------------------------------------------

const INITIAL_STATE: MessagesState = []

// ------------------------------------------------------------------

const addMessage = (state: MessagesState, { message }: AddMessageData): MessagesState =>
	[message, ...state] // we add the new message at the beginning

const removeMessage = (state: MessagesState, { id }: RemoveMessageData): MessagesState =>
	state.filter((message: Message) => message.id !== id)

// ------------------------------------------------------------------

const messagesReducer: Reducer<MessagesState, AppAction> = (
	state: MessagesState = INITIAL_STATE,
	action: AppAction
): MessagesState => {
	switch (action.type) {
	case 'MESSAGE_ADD':
		return addMessage(state, action.data as AddMessageData)
	case 'MESSAGE_REMOVE':
		return removeMessage(state, action.data as RemoveMessageData)
	default:
		return state
	}
}

export default messagesReducer
