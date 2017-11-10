import { combineReducers } from 'redux'
import playlist from './playlist'
import sampling from './sampling'

// --------------------------------------------------------------

export default combineReducers({
	playlist,
	sampling
})