import type { AppThunk, AppDispatch } from '../types'

export const changeSourceBPM = (bpm: number): AppThunk => (dispatch: AppDispatch) => {
	sessionStorage.setItem('DEFAULT_SOURCE_BPM', String(bpm))
	dispatch({
		type: 'SOURCE_SET_BPM',
		data: { bpm }
	})
}

export const changeSourceId = (id: string): AppThunk => (dispatch: AppDispatch) => {
	sessionStorage.setItem('DEFAULT_SOURCE_ID', id)
	dispatch({
		type: 'SOURCE_SET_ID',
		data: { id }
	})
}

export const changeSourceTransformation = (transformation: string): AppThunk => (dispatch: AppDispatch) => {
	sessionStorage.setItem('DEFAULT_SOURCE_TRANSFORMATION', transformation)
	dispatch({
		type: 'SOURCE_SET_TRANSFORMATION',
		data: { transformation }
	})
}

export const changeSourceType = (type: string): AppThunk => (dispatch: AppDispatch) => {
	sessionStorage.setItem('DEFAULT_SOURCE_TYPE', type)
	dispatch({
		type: 'SOURCE_SET_TYPE',
		data: { type }
	})
}
