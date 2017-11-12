import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import { chunkArray } from '../tools'
import Sample from '../containers/Sample'
import './Samples.css'

// --------------------------------------------------------------

class Samples extends Component {
	render() {
		let chunks
		switch (this.props.samplingStrategyId)
		{
			case 'BCF2000_MULTISLIDERS_8_32':
			case 'BCF2000_MULTISLIDERS_8_64':
				chunks = chunkArray(this.props.tracks, this.props.tracks.length / 8)
				break

			case 'LIGHTPADBLOCK_16':
				chunks = chunkArray(this.props.tracks, Math.sqrt(this.props.tracks.length))
				break

			case 'CUSTOM_SOCKET_STRATEGY':
				chunks = chunkArray(this.props.tracks, this.props.tracks.length / 5)
				break

			default:
				chunks = null
				break
		}
		return (
			<div className="samples">
				{
					null !== chunks
					? chunks.map((tracks, index) => <div key={index}>{tracks.map(track => <Sample key={track.id} id={track.id} />)}</div>)
					: this.props.tracks.map(track => <Sample key={track.id} id={track.id} />)
				}
			</div>
		)
	}
}

// --------------------------------------------------------------

Samples.propTypes = {
	audios: PropTypes.array,
	tracks: PropTypes.array,
	samplingStrategyId: PropTypes.string
}

export default Samples
