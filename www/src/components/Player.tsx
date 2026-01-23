import React, { useEffect } from 'react'
//
import type { Track } from '../types'
import PlayerSample from '../containers/PlayerSample'
import './Player.css'

// --------------------------------------------------------------

interface PlayerProps {
	playing: boolean
	tracks: Track[] | null
	onInit: () => void
	onPlay: () => void
	onPause: () => void
	onRegisterCanvas: (canvas: HTMLCanvasElement | null) => void
}

const Player: React.FC<PlayerProps> = ({ playing, tracks, onInit, onPlay, onPause, onRegisterCanvas }) => {
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
				<canvas className="player-timeline" ref={(canvas: HTMLCanvasElement | null) => onRegisterCanvas(canvas)} width="400" height="50"></canvas>
				<div className="player-samples">{tracks.map((sample: Track, sampleIndex: number) => <PlayerSample key={sampleIndex} index={sampleIndex} />)}</div>
			</div>
		)
	}
	else {
		return null // onInit will be called if needed
	}
}

// --------------------------------------------------------------

export default Player
