import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import Player from '../containers/Player'
import Splash from '../containers/Splash'
import './App.css'

// --------------------------------------------------------------

class App extends Component {
	render() {
		return this.props.samplingTracks && this.props.samplingTracks.length > 0 ? <Player /> : <Splash />
	}
}

// --------------------------------------------------------------

App.propTypes = {
	samplingTracks: PropTypes.array
}

export default App
