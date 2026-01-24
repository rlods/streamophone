import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
//
import type { Track } from '../types'
import { usePlayerStore, loadPlayer, play, pause, registerPlayerCanvas } from '../stores'
import PlayerSample from './PlayerSample'
import './Player.css'

// --------------------------------------------------------------

const Player: React.FC = () => {
	const { data } = useParams<{ data: string }>()

	const playing = usePlayerStore((state) => state.playing)
	const tracks = usePlayerStore((state) => state.tracks)

	const onRegisterCanvas = useCallback((canvas: HTMLCanvasElement | null): void => {
		registerPlayerCanvas(canvas)
	}, [])

	useEffect(() => {
		if (null === tracks) {
			loadPlayer(data ?? '')
		}
	}, [tracks, data])

	if (null !== tracks) {
		return (
			<div className="player">
				<div className="player-actions">
				{playing
					? <button onClick={pause}><i className="fa fa-pause" aria-hidden="true"></i></button>
					: <button onClick={play}><i className="fa fa-play" aria-hidden="true"></i></button>}
				</div>
				<canvas className="player-timeline" ref={onRegisterCanvas} width="400" height="50"></canvas>
				<div className="player-samples">{tracks.map((sample, sampleIndex) => <PlayerSample key={sampleIndex} index={sampleIndex} />)}</div>
			</div>
		)
	}
	else {
		return null // loadPlayer will be called if needed
	}
}

// --------------------------------------------------------------

export default Player
