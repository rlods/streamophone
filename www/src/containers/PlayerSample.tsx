import React from 'react'
//
import PlayerSampleComponent from '../components/PlayerSample'
import { usePlayerStore } from '../stores'

// --------------------------------------------------------------

interface PlayerSampleProps {
	index: number
}

const PlayerSample: React.FC<PlayerSampleProps> = ({ index }) => {
	const track = usePlayerStore((state) => state.tracks![index])

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
