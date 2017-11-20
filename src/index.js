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
import AudioPlayer from './audio/AudioPlayer'
import AudioSampler from './audio/AudioSampler'
import { createDrivers } from './drivers'
import config from './config'
import './index.css'

// --------------------------------------------------------------

const app = {
	audioPlayer: new AudioPlayer(),
	audioSampler: new AudioSampler(),
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

app.audioPlayer.attachDispatcher(store.dispatch.bind(this))
app.audioSampler.attachDispatcher(store.dispatch.bind(this))
Object.values(app.drivers).forEach(driver => driver.attachDispatcher(store.dispatch.bind(this)))

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
