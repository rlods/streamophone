import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
// import { BrowserRouter as Router } from 'react-router-dom' // should be used when you have a server that will handle dynamic requests (knows how to respond to any possible URI)
import { HashRouter as Router, Route } from 'react-router-dom' // should be used for static websites
import logger from 'redux-logger'
import thunk from 'redux-thunk'
// ...
import rootReducer from './reducers'
//import registerServiceWorker from './registerServiceWorker'
import App from './containers/App'
import { createDrivers } from './drivers'
import config from './config'
import AudioEngine from './tools/AudioEngine'
import AudioPlayer from './tools/AudioPlayer'
import './index.css'

// --------------------------------------------------------------

const app = {
	audioEngine: new AudioEngine(),
	audioPlayer: new AudioPlayer(),
	drivers: createDrivers(),
	strategy: null
}

// --------------------------------------------------------------

const middlewares = [
	thunk.withExtraArgument({ app }),
	config.ENABLE_LOGGER && logger
].filter(middleware => !!middleware)

const store = createStore(rootReducer, {}, applyMiddleware(...middlewares))

// --------------------------------------------------------------

app.audioPlayer.attach(store.dispatch.bind(this))
Object.values(app.drivers).forEach(driver => driver.attach(store.dispatch.bind(this)))

// --------------------------------------------------------------

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Route path="/" component={App} />
		</Router>
	</Provider>,
	document.getElementById('root')
)

//registerServiceWorker()
