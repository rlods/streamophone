import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
//
import PlayerSample from '../containers/PlayerSample'
import './Player.css'

// --------------------------------------------------------------

const Player = ({ playing, tracks, onInit, onPlay, onPause, onRegisterCanvas }) => {
	useEffect(() => {
		if (null === tracks) {
			onInit()
		}
	}, [tracks, onInit])

	if (null !== tracks) {
		return (
			<div className="player">
				<div className="player-actions">
				{playing
					? <button onClick={onPause}><i className="fa fa-pause" aria-hidden="true"></i></button>
					: <button onClick={onPlay}><i className="fa fa-play" aria-hidden="true"></i></button>}
				</div>
				<canvas className="player-timeline" ref={canvas => onRegisterCanvas(canvas)} width="400" height="50"></canvas>
				<div className="player-samples">{tracks.map((sample, sampleIndex) => <PlayerSample key={sampleIndex} index={sampleIndex} />)}</div>
			</div>
		)
	}
	else {
		return null // onInit will be called if needed
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
