import React from 'react'
import { createRoot } from 'react-dom/client'
// import { BrowserRouter as Router } from 'react-router-dom' // should be used when you have a server that will handle dynamic requests (knows how to respond to any possible URI)
import { HashRouter as Router } from 'react-router-dom' // should be used for static websites
// ...
import App from './components/App'
import AudioPlayer from './audio/AudioPlayer'
import AudioSampler from './audio/AudioSampler'
import { createDrivers } from './drivers'
import type Driver from './drivers/Driver'
import { setAudioPlayer, setAudioSampler, handleMidiEvent, handleSocketEvent } from './stores'
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

// Initialize stores with audio references (callbacks are automatically connected)
setAudioPlayer(app.audioPlayer)
setAudioSampler(app.audioSampler)

// Connect drivers with callbacks
Object.values(app.drivers).forEach(driver => {
	driver.setCallbacks({
		onMidiEvent: handleMidiEvent,
		onSocketEvent: handleSocketEvent
	})
})

// --------------------------------------------------------------

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
	<Router>
		<App />
	</Router>
)
