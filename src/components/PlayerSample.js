import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import { fmtMSS } from '../tools'
import './PlayerSample.css'

// --------------------------------------------------------------

class PlayerSample extends Component {
	render() {
		return (
			<div className={classNames('player-sample', { playing: this.props.playing })}>
				<a className="player-sample-title" target="_blank" rel="noopener noreferrer" href={this.props.url}>{this.props.title}</a>
				<div className="player-sample-metas">
					{this.props.ready ? null : <i className="fa fa-exclamation-triangle player-sample-meta player-sample-meta-notready" title="not ready"></i>}
				</div>
				<div className="player-sample-totalDuration">{fmtMSS(this.props.totalDuration)}</div>
			</div>
		)
	}
}

// --------------------------------------------------------------

PlayerSample.propTypes = {
	playing: PropTypes.bool,
	ready: PropTypes.bool,
	title: PropTypes.string,
	totalDuration: PropTypes.number,
	url: PropTypes.string
}

export default PlayerSample
