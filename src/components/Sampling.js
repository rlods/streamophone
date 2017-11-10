import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Sampling.css'

// --------------------------------------------------------------

class Sample extends Component {
	render() {
		return (
			<div className="Sample">
				<a href={this.props.link} target="_blank">
					<img src={this.props.album.cover_medium} />
					<span>{this.props.title}</span>
				</a>
			</div>
		)
	}
}

// --------------------------------------------------------------

class Samples extends Component {
	render() {
		return (
			<div className="Samples">
				{this.props.tracks.map(track => <Sample key={track.id} {...track} />)}
			</div>
		)
	}
}

// --------------------------------------------------------------

Samples.propTypes = {
	audios: PropTypes.array,
	tracks: PropTypes.array
}

export default Samples
