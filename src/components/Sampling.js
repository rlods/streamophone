import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import './Sampling.css'

// --------------------------------------------------------------

class Sample extends Component {
	render() {
		return (
			<div className={classNames('Sample', { playing: this.props.playing })}>
				<a href={this.props.link} target="_blank">
					<img src={this.props.album.cover_medium} alt={this.props.title} />
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
