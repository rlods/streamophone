import React from 'react'
import { Routes, Route } from 'react-router-dom'
import classNames from 'classnames'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
//
import type { Message } from '../types'
import Player from '../containers/Player'
import Sampler from '../containers/Sampler'
import Splash from '../containers/Splash'
import './App.css'

// --------------------------------------------------------------

interface AppProps {
	messages: Message[]
}

const App: React.FC<AppProps> = ({ messages }) => (
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

// --------------------------------------------------------------

export default App
