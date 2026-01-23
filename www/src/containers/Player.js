import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
//
import { loadPlayer, play, pause, registerPlayerCanvas } from '../actions/player'
import PlayerComponent from '../components/Player'

// --------------------------------------------------------------

const Player = () => {
	const dispatch = useDispatch()
	const { data } = useParams()

	const playing = useSelector(state => state.player.playing)
	const tracks = useSelector(state => state.player.tracks)

	const onInit = useCallback(() => dispatch(loadPlayer(data)), [dispatch, data])
	const onPlay = useCallback(() => dispatch(play()), [dispatch])
	const onPause = useCallback(() => dispatch(pause()), [dispatch])
	const onRegisterCanvas = useCallback(canvas => dispatch(registerPlayerCanvas(canvas)), [dispatch])

	return (
		<PlayerComponent
			playing={playing}
			tracks={tracks}
			onInit={onInit}
			onPlay={onPlay}
			onPause={onPause}
			onRegisterCanvas={onRegisterCanvas}
		/>
	)
}

export default Player
