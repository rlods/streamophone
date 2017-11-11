import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route/*, IndexRoute*/ } from 'react-router-dom'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import './index.css'
// import createApi from './api'
import rootReducer from './reducers'
import registerServiceWorker from './registerServiceWorker'
// ...
import App from './containers/App'
import MidiController from './midi/MidiController'
import SocketController from './midi/SocketController'

// --------------------------------------------------------------

const midiController = new MidiController()
const socketController = new SocketController('http://129.102.147.114:3000', 'main')

const enableLogger = false // process.env.NODE_ENV !== 'production'

const middlewares = [
	thunk.withExtraArgument(midiController),
	thunk.withExtraArgument(socketController),
	enableLogger && logger
].filter(Boolean) // filter is used to disable middlewares (ex. like for example logger which becomes false when enableLogger = false)

const store = createStore(rootReducer, {}, applyMiddleware(...middlewares))

midiController.attach(store.dispatch.bind(this))
socketController.attach(store.dispatch.bind(this))

// --------------------------------------------------------------

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Route exact path="/" component={App} />
		</Router>
	</Provider>,
	document.getElementById('root')
)

registerServiceWorker()
