import React from 'react'
import classNames from 'classnames'
//
import { fmtMSS } from '../tools'
import './PlayerSample.css'

// --------------------------------------------------------------

interface PlayerSampleProps {
	playing: boolean
	ready: boolean
	title: string
	totalDuration?: number
	url: string
}

const PlayerSample: React.FC<PlayerSampleProps> = ({ playing, ready, title, totalDuration, url }) => (
	<div className={classNames('player-sample', { playing })}>
		<a className="player-sample-title" target="_blank" rel="noopener noreferrer" href={url}>{title}</a>
		<div className="player-sample-metas">
			{ready ? null : <i className="fa fa-exclamation-triangle player-sample-meta player-sample-meta-notready" title="not ready"></i>}
		</div>
		<div className="player-sample-totalDuration">{fmtMSS(totalDuration)}</div>
	</div>
)

// --------------------------------------------------------------

export default PlayerSample
