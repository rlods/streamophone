import type { AppThunk, AppDispatch } from '../types'

let MESSAGE_ID_GENERATOR = 0

export const removeMessage = (id: number) => ({
	type: 'MESSAGE_REMOVE' as const,
	data: { id }
})

export const displayMessage = (
	type: 'info' | 'error' | 'warning',
	text: string,
	duration: number = 5000
): AppThunk => (dispatch: AppDispatch) => {
	const id = MESSAGE_ID_GENERATOR++
	dispatch({
		type: 'MESSAGE_ADD',
		data: { message: { id, text, type } }
	})
	setTimeout(() => {
		dispatch(removeMessage(id))
	}, duration)
}

export const displayError = (text: string, duration: number = 5000): AppThunk =>
	displayMessage('error', text, duration)
