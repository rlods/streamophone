import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import { chunkArray } from '../tools'
import { StrategyTypes } from '../controllers/Strategy'
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
		switch (this.props.samplerType)
		{
			case StrategyTypes.BCF2000_MULTISLIDERS_8_32.id:
			case StrategyTypes.BCF2000_MULTISLIDERS_8_64.id: 
				const chunks1 = chunkArray(this.props.tracks, this.props.tracks.length / 8, tracks => tracks)
				return (
					<div className="samples">
						{chunks1.map((tracks, index) => <div key={index}>{tracks.map(track => <Sample key={track.id} {...track} />)}</div>)}
					</div>
				)
			case StrategyTypes.LIGHTPADBLOCK_16.id:
				const chunks2 = chunkArray(this.props.tracks, Math.sqrt(this.props.tracks.length), tracks => tracks)
				return (
					<div className="samples">
						{chunks2.map((tracks, index) => <div key={index}>{tracks.map(track => <Sample key={track.id} {...track} />)}</div>)}
					</div>
				)
			case StrategyTypes.CUSTOM_SOCKET_STRATEGY.id:
				const chunks3 = chunkArray(this.props.tracks, this.props.tracks.length / 5, tracks => tracks)
				return (
					<div className="samples">
						{chunks3.map((tracks, index) => <div key={index}>{tracks.map(track => <Sample key={track.id} {...track} />)}</div>)}
					</div>
				)			
			default:
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
