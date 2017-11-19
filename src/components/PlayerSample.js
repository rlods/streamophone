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
				<span className="player-sample-xxxDuration" >{fmtMSS(this.props.xxxDuration)}</span>
			</div>
		)
	}
}

// --------------------------------------------------------------

PlayerSample.propTypes = {
	playing: PropTypes.bool,
	title: PropTypes.string,
	url: PropTypes.string,
	xxxDuration: PropTypes.number
}

export default PlayerSample
