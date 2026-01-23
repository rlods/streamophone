import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
//
import { usePlayerStore, loadPlayer, play, pause, registerPlayerCanvas } from '../stores'
import PlayerComponent from '../components/Player'

// --------------------------------------------------------------

const Player: React.FC = () => {
	const { data } = useParams<{ data: string }>()

	const playing = usePlayerStore((state) => state.playing)
	const tracks = usePlayerStore((state) => state.tracks)

	const onInit = useCallback((): void => {
		loadPlayer(data ?? '')
	}, [data])

	const onPlay = useCallback((): void => {
		play()
	}, [])

	const onPause = useCallback((): void => {
		pause()
	}, [])

	const onRegisterCanvas = useCallback((canvas: HTMLCanvasElement | null): void => {
		registerPlayerCanvas(canvas)
	}, [])

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
