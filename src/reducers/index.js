import { combineReducers } from 'redux'
import app from './app'
import player from './player'
import messages from './messages'
import sampling from './sampling'
import source from './source'

// --------------------------------------------------------------

export default combineReducers({
	app,
	player,
	messages,
	sampling,
	source
})