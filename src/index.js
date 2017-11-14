import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
// import { BrowserRouter as Router } from 'react-router-dom' // should be used when you have a server that will handle dynamic requests (knows how to respond to any possible URI)
import { HashRouter as Router } from 'react-router-dom' // should be used for static websites
import logger from 'redux-logger'
import thunk from 'redux-thunk'
// ...
import rootReducer from './reducers'
import registerServiceWorker from './registerServiceWorker'
import App from './containers/App'
import Driver from './drivers/Driver'
import MidiDriver from './drivers/MidiDriver'
import SocketDriver from './drivers/SocketDriver'
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
			driver = new Driver()
			break 
		case 'midi':
			driver = new MidiDriver()
			break 
		case 'socket':
			driver = new SocketDriver(driverDefinition.socketUrl, driverDefinition.socketPrefix)
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
			<App />
		</Router>
	</Provider>,
	document.getElementById('root')
)

registerServiceWorker()
