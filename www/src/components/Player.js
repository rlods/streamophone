import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import PlayerSample from '../containers/PlayerSample'
import './Player.css'

// --------------------------------------------------------------

class Player extends Component {
	componentWillMount() {
		if (null === this.props.tracks)	
			this.props.onInit()
	}

	render() {
		if (null !== this.props.tracks) {
			return (
				<div className="player">
					<div className="player-actions">
					{this.props.playing
						? <button onClick={this.props.onPause}><i className="fa fa-pause" aria-hidden="true"></i></button>
						: <button onClick={this.props.onPlay}><i className="fa fa-play" aria-hidden="true"></i></button>}
					</div>
					<canvas className="player-timeline" ref={canvas => this.props.onRegisterCanvas(canvas)} width="400" height="50"></canvas>
					<div className="player-samples">{this.props.tracks.map((sample, sampleIndex) => <PlayerSample key={sampleIndex} index={sampleIndex} />)}</div>
				</div>
			)
		}
		else {
			return null // onInit will be called if needed
		}
	}
}

// --------------------------------------------------------------

Player.propTypes = {
	playing: PropTypes.bool,
	tracks: PropTypes.array,
	//
	onInit: PropTypes.func,
	onPlay: PropTypes.func,
	onPause: PropTypes.func,
	onRegisterCanvas: PropTypes.func
}

export default Player
