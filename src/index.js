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
import MidiController from './midiControllerMultislides'

// --------------------------------------------------------------

const midiController = new MidiController()

const enableLogger = false // process.env.NODE_ENV !== 'production'

const middlewares = [
	thunk.withExtraArgument(midiController),
	enableLogger && logger
].filter(Boolean) // filter is used to disable middlewares (ex. like for example logger which becomes false when enableLogger = false)

const store = createStore(rootReducer, {}, applyMiddleware(...middlewares))

midiController.attach(store.dispatch.bind(this))

// --------------------------------------------------------------

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<div>
				<Route exact path="/" component={App} />
			</div>
		</Router>
	</Provider>,
	document.getElementById('root')
)

registerServiceWorker()
