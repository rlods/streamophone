import { combineReducers } from 'redux'
import app from './app'
import messages from './messages'
import playlist from './playlist'
import sampling from './sampling'

// --------------------------------------------------------------

export default combineReducers({
	app,
	messages,
	playlist,
	sampling
})