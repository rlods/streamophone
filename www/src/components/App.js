import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import classNames from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
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
					<ReactCSSTransitionGroup
						transitionName="app-message"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={500}>
						{this.props.messages.map(message => <div key={message.id} className={classNames('app-message', 'app-message-' + message.type)}>{message.text}</div>)}
					</ReactCSSTransitionGroup>
				</div>
				<div className="app-head">
					<h1 className="app-title">
						streamo
					</h1>
				</div>
				<div className="app-body">
					<Switch>
						<Route exact path="/" component={Splash} />
						<Route exact path="/make" component={Sampler} />
						<Route exact path="/play/:data" component={Player} />
					</Switch>
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

