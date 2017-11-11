import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import { chunkArray } from '../tools'
import { StrategyTypes } from '../controllers/strategies'
import './Sampling.css'

// --------------------------------------------------------------

class Sample extends Component {
	render() {
		return (
			<div className={classNames('sample', { playing: this.props.playing })}>
				<img className="sample-cover" src={this.props.album.cover_medium} alt={this.props.title} />
				<div className="sample-info">{this.props.title}</div>
			</div>
		)
	}
}

// --------------------------------------------------------------

class Samples extends Component {
	render() {
		let chunks = null
		switch (this.props.samplerType)
		{
			case StrategyTypes.KEYBOARD_AZERTY.id:
				chunks = chunkArray(this.props.tracks, 3)
				break
			case StrategyTypes.BCF2000_MULTISLIDERS_8_32.id:
			case StrategyTypes.BCF2000_MULTISLIDERS_8_64.id:
				chunks = chunkArray(this.props.tracks, this.props.tracks.length / 8)
				break
			case StrategyTypes.LIGHTPADBLOCK_16.id:
				chunks = chunkArray(this.props.tracks, Math.sqrt(this.props.tracks.length))
				break
			case StrategyTypes.CUSTOM_SOCKET_STRATEGY.id:
				chunks = chunkArray(this.props.tracks, this.props.tracks.length / 5)
				break
		}
		if (null !== chunks) {
			return (
				<div className="samples">
					{chunks.map((tracks, index) => <div key={index}>{tracks.map(track => <Sample key={track.id} {...track} />)}</div>)}
				</div>
			)
		}
		else {
			return (
				<div className="samples">
					{this.props.tracks.map(track => <Sample key={track.id} {...track} />)}
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
