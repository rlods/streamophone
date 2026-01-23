import React from 'react'
import { useSelector } from 'react-redux'
//
import AppComponent from '../components/App'
import type { RootState } from '../types'

// --------------------------------------------------------------

const App: React.FC = () => {
	const messages = useSelector((state: RootState) => state.messages)
	const ready = useSelector((state: RootState) => !!state.sampler.tracks)

	return <AppComponent messages={messages} ready={ready} />
}

export default App
