import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import { fmtMSS } from '../tools'
import './PlayerSample.css'

// --------------------------------------------------------------

const PlayerSample = ({ playing, ready, title, totalDuration, url }) => (
	<div className={classNames('player-sample', { playing })}>
		<a className="player-sample-title" target="_blank" rel="noopener noreferrer" href={url}>{title}</a>
		<div className="player-sample-metas">
			{ready ? null : <i className="fa fa-exclamation-triangle player-sample-meta player-sample-meta-notready" title="not ready"></i>}
		</div>
		<div className="player-sample-totalDuration">{fmtMSS(totalDuration)}</div>
	</div>
)

// --------------------------------------------------------------

PlayerSample.propTypes = {
	playing: PropTypes.bool,
	ready: PropTypes.bool,
	title: PropTypes.string,
	totalDuration: PropTypes.number,
	url: PropTypes.string
}

export default PlayerSample
