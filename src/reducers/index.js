import { combineReducers } from 'redux'
import app from './app'
import messages from './messages'
import sampling from './sampling'
import source from './source'

// --------------------------------------------------------------

export default combineReducers({
	app,
	messages,
	sampling,
	source
})