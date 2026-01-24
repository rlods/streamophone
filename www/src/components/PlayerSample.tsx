import React from 'react'
import classNames from 'classnames'
//
import { fmtMSS } from '../tools'
import { usePlayerStore } from '../stores'
import './PlayerSample.css'

// --------------------------------------------------------------

interface PlayerSampleProps {
	index: number
}

const PlayerSample: React.FC<PlayerSampleProps> = ({ index }) => {
	const track = usePlayerStore((state) => state.tracks![index])

	return (
		<div className={classNames('player-sample', { playing: track.playing })}>
			<a className="player-sample-title" target="_blank" rel="noopener noreferrer" href={track.url}>{track.title}</a>
			<div className="player-sample-metas">
				{track.ready ? null : <i className="fa fa-exclamation-triangle player-sample-meta player-sample-meta-notready" title="not ready"></i>}
			</div>
			<div className="player-sample-totalDuration">{fmtMSS(track.totalDuration ?? 0)}</div>
		</div>
	)
}

// --------------------------------------------------------------

export default PlayerSample
