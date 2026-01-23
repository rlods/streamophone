import React from 'react'
import { createRoot } from 'react-dom/client'
// import { BrowserRouter as Router } from 'react-router-dom' // should be used when you have a server that will handle dynamic requests (knows how to respond to any possible URI)
import { HashRouter as Router } from 'react-router-dom' // should be used for static websites
// ...
import App from './containers/App'
import AudioPlayer from './audio/AudioPlayer'
import AudioSampler from './audio/AudioSampler'
import { createDrivers } from './drivers'
import Driver from './drivers/Driver'
import { setAudioPlayer, setAudioSampler } from './stores'
import { createDispatchAdapter } from './stores/dispatchAdapter'
import config from './config'
import './index.css'

// --------------------------------------------------------------

console.log('CONFIG', config)

interface AppInstance {
	audioPlayer: AudioPlayer
	audioSampler: AudioSampler
	drivers: Record<string, Driver>
}

const app: AppInstance = {
	audioPlayer: new AudioPlayer(),
	audioSampler: new AudioSampler(),
	drivers: createDrivers()
}

// --------------------------------------------------------------

// Initialize stores with audio references
setAudioPlayer(app.audioPlayer)
setAudioSampler(app.audioSampler)

// Create dispatch adapter that routes Redux-style actions to Zustand stores
const dispatch = createDispatchAdapter()

// Attach dispatch adapter to audio components and drivers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.audioPlayer.attachDispatcher(dispatch as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.audioSampler.attachDispatcher(dispatch as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Object.values(app.drivers).forEach(driver => driver.attachDispatcher(dispatch as any))

// --------------------------------------------------------------

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
	<Router>
		<App />
	</Router>
)
