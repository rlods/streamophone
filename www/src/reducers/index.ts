import { combineReducers } from 'redux'
import type { Reducer } from 'redux'
import app from './app'
import player from './player'
import messages from './messages'
import sampler from './sampler'
import source from './source'
import type { RootState, AppAction } from '../types'

// --------------------------------------------------------------

const rootReducer: Reducer<RootState, AppAction> = combineReducers({
	app,
	player,
	messages,
	sampler,
	source
})

export default rootReducer
