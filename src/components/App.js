import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
//
import Player from '../containers/Player'
import Sampler from '../containers/Sampler'
import Splash from '../containers/Splash'
import './App.css'

// --------------------------------------------------------------

class App extends Component {
	render() {
		return (
			<Switch>
				<Route exact path="/" component={Splash} />
				<Route exact path="/make" component={Sampler} />
				<Route exact path="/play/:data" component={Player} />
			</Switch>
		)
	}
}

// --------------------------------------------------------------

App.propTypes = {
	ready: PropTypes.bool
}

export default App

