import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import { chunkArray } from '../tools'
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
		if (false) { //this.props.samplerType === 'standard') {
			return (
				<div className="Samples">
					{this.props.tracks.map(track => <Sample key={track.id} {...track} />)}
				</div>
			)
		}
		else {
			const chunks = chunkArray(this.props.tracks, this.props.tracks.length / 8, tracks => tracks)
			return (
				<div className="Samples">
					{chunks.map((tracks, index) => <div key={index}>{tracks.map(track => <Sample key={track.id} {...track} />)}</div>)}
				</div>
			)
		}
	}
}

// --------------------------------------------------------------

Samples.propTypes = {
	audios: PropTypes.array,
	tracks: PropTypes.array,
	samplerType: PropTypes.string
}

export default Samples
