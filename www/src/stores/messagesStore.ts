import { create } from 'zustand'
import type { Message } from '../types'

// ------------------------------------------------------------------

interface MessagesState {
	messages: Message[]
	addMessage: (message: Message) => void
	removeMessage: (id: number) => void
}

let MESSAGE_ID_GENERATOR = 0

export const useMessagesStore = create<MessagesState>((set) => ({
	messages: [],

	addMessage: (message: Message) =>
		set((state) => ({
			messages: [message, ...state.messages]
		})),

	removeMessage: (id: number) =>
		set((state) => ({
			messages: state.messages.filter((message) => message.id !== id)
		}))
}))

// ------------------------------------------------------------------
// Helper actions

export const displayMessage = (
	type: 'info' | 'error' | 'warning',
	text: string,
	duration: number = 5000
): void => {
	const id = MESSAGE_ID_GENERATOR++
	useMessagesStore.getState().addMessage({ id, text, type })
	setTimeout(() => {
		useMessagesStore.getState().removeMessage(id)
	}, duration)
}

export const displayError = (text: string, duration: number = 5000): void => {
	displayMessage('error', text, duration)
}
