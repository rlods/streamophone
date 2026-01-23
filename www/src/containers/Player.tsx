import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
//
import { loadPlayer, play, pause, registerPlayerCanvas } from '../actions/player'
import PlayerComponent from '../components/Player'
import type { RootState, AppDispatch } from '../types'

// --------------------------------------------------------------

const Player: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { data } = useParams<{ data: string }>()

	const playing = useSelector((state: RootState) => state.player.playing)
	const tracks = useSelector((state: RootState) => state.player.tracks)

	const onInit = useCallback((): void => {
		dispatch(loadPlayer(data))
	}, [dispatch, data])

	const onPlay = useCallback((): void => {
		dispatch(play())
	}, [dispatch])

	const onPause = useCallback((): void => {
		dispatch(pause())
	}, [dispatch])

	const onRegisterCanvas = useCallback((canvas: HTMLCanvasElement | null): void => {
		dispatch(registerPlayerCanvas(canvas))
	}, [dispatch])

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
