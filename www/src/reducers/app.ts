import type { Reducer } from 'redux'
import type { AppState, AppAction } from '../types'

// ------------------------------------------------------------------

const INITIAL_STATE: AppState = {}

// ------------------------------------------------------------------

const appReducer: Reducer<AppState, AppAction> = (
	state: AppState = INITIAL_STATE,
	action: AppAction
): AppState => {
	switch (action.type) {
	default:
		return state
	}
}

export default appReducer
