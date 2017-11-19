import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import AudioRecord from '../tools/AudioRecord'
import PlayerSample from '../containers/PlayerSample'
import './Player.css'

// --------------------------------------------------------------

class Player extends Component {
	componentWillMount() {
		if (!this.props.record)
			this.props.onLoadPlayer()
	}

	render() {
		if (this.props.record) {
			return (
				<div className="player">
					<div className="player-actions">
						<button onClick={this.props.record.play.bind(this.props.record)}>LISTEN</button>
					</div>
					<canvas className="player-timeline" ref={canvas => this.props.record.setCanvas(canvas)} width="400" height="50"></canvas>
					<div className="player-samples">{this.props.record.data.tracks.map((sample, sampleIndex) => <PlayerSample key={sampleIndex} index={sampleIndex} />)}</div>
				</div>
			)
		}
		else {
			return null
		}
	}
}

// --------------------------------------------------------------

Player.propTypes = {
	record: PropTypes.instanceOf(AudioRecord),
	//
	onLoadPlayer: PropTypes.func
}

export default Player
