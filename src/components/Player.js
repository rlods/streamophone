import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import Samples from '../containers/Sampling'
import './Player.css'

// --------------------------------------------------------------

class Player extends Component {
	render() {
		return (
			<div className="player">
				<input className="player-control" type="text" value="" placeholder="Click here to play with your keyboard" onKeyDown={this.props.onPlayStart} onKeyUp={this.props.onPlayStop} />
				<Samples />
			</div>
		)
	}
}

// --------------------------------------------------------------

Player.propTypes = {
	playlistTitle: PropTypes.string,
	playlistUrl: PropTypes.string,
	//
	onPlayStart: PropTypes.func,
	onPlayStop: PropTypes.func
}

export default Player
