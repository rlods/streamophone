import React from 'react'
import { Routes, Route } from 'react-router-dom'
import classNames from 'classnames'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
//
import type { Message } from '../types'
import { useMessagesStore } from '../stores'
import Player from './Player'
import Sampler from './Sampler'
import Splash from './Splash'
import './App.css'

// --------------------------------------------------------------

const App: React.FC = () => {
	const messages = useMessagesStore((state) => state.messages)

	return (
		<div className="app">
			<div className="app-messages">
				<TransitionGroup>
					{messages.map((message: Message) => (
						<CSSTransition
							key={message.id}
							classNames="app-message"
							timeout={500}>
							<div className={classNames('app-message', 'app-message-' + message.type)}>{message.text}</div>
						</CSSTransition>
					))}
				</TransitionGroup>
			</div>
			<div className="app-head">
				<h1 className="app-title">
					streamo
				</h1>
			</div>
			<div className="app-body">
				<Routes>
					<Route path="/" element={<Splash />} />
					<Route path="/make" element={<Sampler />} />
					<Route path="/play/:data" element={<Player />} />
				</Routes>
			</div>
		</div>
	)
}

// --------------------------------------------------------------

export default App
