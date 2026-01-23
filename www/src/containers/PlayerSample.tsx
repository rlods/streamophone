import React from 'react'
import { useSelector } from 'react-redux'
//
import PlayerSampleComponent from '../components/PlayerSample'
import type { RootState } from '../types'

// --------------------------------------------------------------

interface PlayerSampleProps {
	index: number
}

const PlayerSample: React.FC<PlayerSampleProps> = ({ index }) => {
	const track = useSelector((state: RootState) => state.player.tracks![index])

	return (
		<PlayerSampleComponent
			playing={track.playing}
			ready={track.ready}
			title={track.title}
			totalDuration={track.totalDuration}
			url={track.url}
		/>
	)
}

export default PlayerSample
