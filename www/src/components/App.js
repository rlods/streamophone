import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Routes, Route } from 'react-router-dom'
import classNames from 'classnames'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
//
import Player from '../containers/Player'
import Sampler from '../containers/Sampler'
import Splash from '../containers/Splash'
import './App.css'

// --------------------------------------------------------------

class App extends Component {
	render() {
		return (
			<div className="app">
				<div className="app-messages">
					<TransitionGroup>
						{this.props.messages.map(message => (
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
}

// --------------------------------------------------------------

App.propTypes = {
	messages: PropTypes.array,
	ready: PropTypes.bool
}

export default App
