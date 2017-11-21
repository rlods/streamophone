import { combineReducers } from 'redux'
import app from './app'
import player from './player'
import messages from './messages'
import sampler from './sampler'
import source from './source'

// --------------------------------------------------------------

export default combineReducers({
	app,
	player,
	messages,
	sampler,
	source
})