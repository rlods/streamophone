import React from 'react'
//
import AppComponent from '../components/App'
import { useMessagesStore, useSamplerStore } from '../stores'

// --------------------------------------------------------------

const App: React.FC = () => {
	const messages = useMessagesStore((state) => state.messages)
	const ready = useSamplerStore((state) => !!state.tracks)

	return <AppComponent messages={messages} ready={ready} />
}

export default App
