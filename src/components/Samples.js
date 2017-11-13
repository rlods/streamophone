import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import { chunkArray } from '../tools'
import Sample from '../containers/Sample'
import './Samples.css'

// --------------------------------------------------------------

const KEY_ORDER_AZERTY = 'AZERTYUIOPQSDFGHJKLMWXCVBN'

// --------------------------------------------------------------

class Samples extends Component {
	render() {
		let chunks, samples
		switch (this.props.samplingStrategyId)
		{
			case 'KEYBOARD_AZERTY':
				samples = this.props.tracks.map((sample, sampleIndex) => <Sample key={sampleIndex} index={sampleIndex} info={KEY_ORDER_AZERTY[sampleIndex]} />)
				break

			case 'BCF2000_MULTISLIDERS':
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
					samples
					? samples : chunks
					? chunks.map((chunk, chunkIndex) => <div key={chunkIndex}>{chunk.map((sample, sampleIndex) => <Sample key={sampleIndex} index={sampleIndex} />)}</div>)
					: this.props.tracks.map((sample, sampleIndex) => <Sample key={sampleIndex} index={sampleIndex} />)
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
