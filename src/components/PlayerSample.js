import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import './PlayerSample.css'

// --------------------------------------------------------------

class PlayerSample extends Component {
	render() {
		return (
			<div className="player-sample">
				<a className="player-sample-title" target="_blank" rel="noopener noreferrer" href={this.props.url}>{this.props.title}</a>
			</div>
		)
	}
}

// --------------------------------------------------------------

PlayerSample.propTypes = {
	title: PropTypes.string,
	url: PropTypes.string
}

export default PlayerSample
