import React from 'react'
import { useSelector } from 'react-redux'
//
import AppComponent from '../components/App'

// --------------------------------------------------------------

const App = () => {
	const messages = useSelector(state => state.messages)
	const ready = useSelector(state => !!state.sampler.tracks)

	return <AppComponent messages={messages} ready={ready} />
}

export default App
