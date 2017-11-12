import { combineReducers } from 'redux'
import app from './app'
import playlist from './playlist'
import sampling from './sampling'

// --------------------------------------------------------------

export default combineReducers({
	app,
	playlist,
	sampling
})