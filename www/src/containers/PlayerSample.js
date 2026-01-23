import React from 'react'
import { useSelector } from 'react-redux'
//
import PlayerSampleComponent from '../components/PlayerSample'

// --------------------------------------------------------------

const PlayerSample = ({ index }) => {
	const track = useSelector(state => state.player.tracks[index])

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
