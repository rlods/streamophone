import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route/*, IndexRoute*/ } from 'react-router-dom'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
// ...
import rootReducer from './reducers'
import registerServiceWorker from './registerServiceWorker'
import App from './containers/App'
import Controller from './controllers/Controller'
import MidiController from './controllers/MidiController'
import SocketController from './controllers/SocketController'
import KeyboardBasicStrategy from './controllers/strategies/KeyboardBasicStrategy'
import config from './config'
import './index.css'

// --------------------------------------------------------------

const drivers = {}
Object.entries(config.DRIVERS).forEach(([driverId, driverDefinition]) => {
	try {
		let driver
		switch (driverDefinition.type)
		{
			case 'basic':
				driver = new Controller(new KeyboardBasicStrategy()) // Basic controller with basic strategy (eg. for computer keyboard)
				break 
			case 'midi':
				driver = new MidiController()
				break 
			case 'socket':
				driver = new SocketController(driverDefinition.socketUrl, driverDefinition.socketPrefix)
				break
			default:
				throw new Error(`Unknown driver type "${driverDefinition.type}"`)
		}
		drivers[driverId] = driver
	}
	catch (error) {
		console.log('Cannot register driver', error)
	}
})

// --------------------------------------------------------------

const middlewares = [
	thunk.withExtraArgument({ drivers }),
	config.ENABLE_LOGGER && logger
].filter(middleware => !!middleware)

const store = createStore(rootReducer, {}, applyMiddleware(...middlewares))
Object.values(drivers).forEach(driver => driver.attach(store.dispatch.bind(this)))

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
