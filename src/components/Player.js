import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Player.css'

// --------------------------------------------------------------

class Player extends Component {
	render() {
		return (
			<div className="Field">
				<label>Player</label>
				<input type="text" value="" placeholder="Player..." onKeyDown={this.props.onPlayStart} onKeyUp={this.props.onPlayStop} />
			</div>
		)
	}
}

// --------------------------------------------------------------

Player.propTypes = {
	onPlayStart: PropTypes.func,
	onPlayStop: PropTypes.func
}

export default Player
