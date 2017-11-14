import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import { chunkArray } from '../tools'
import Sample from '../containers/Sample'
import './Player.css'

// --------------------------------------------------------------

const KEY_ORDER_AZERTY = 'AZERTYUIOPQSDFGHJKLMWXCVBN'

// --------------------------------------------------------------

class Player extends Component {
	componentWillMount() {
		document.addEventListener("keydown", this.props.onKeyDown.bind(this))
		document.addEventListener("keyup", this.props.onKeyUp.bind(this))
		if (!this.props.tracks) {
			// Because user directly opened the /play page not from the splash screen
			this.props.onInit()
		}
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.props.onKeyDown.bind(this))
		document.addEventListener("keyup", this.props.onKeyUp.bind(this))
	}

	render() {
		if (null !== this.props.tracks) {
			let chunks, chunkSize, samples
			switch (this.props.samplingStrategyId)
			{
				case 'KEYBOARD_AZERTY':
					samples = this.props.tracks.map((sample, sampleIndex) => <Sample key={sampleIndex} index={sampleIndex} info={KEY_ORDER_AZERTY[sampleIndex]} />)
					break

				case 'BCF2000_MULTISLIDERS':
					chunkSize = this.props.tracks.length / 8
					chunks = chunkArray(this.props.tracks, chunkSize)
					break

				case 'LIGHTPADBLOCK_16':
					chunkSize = Math.sqrt(this.props.tracks.length)
					chunks = chunkArray(this.props.tracks, chunkSize)
					break

				case 'CUSTOM_SOCKET_STRATEGY':
					chunkSize = this.props.tracks.length / 5
					chunks = chunkArray(this.props.tracks, chunkSize)
					break

				default:
					chunks = null
					break
			}
			return (
				<div className="player">
					{
						samples
						? samples : chunks
						? chunks.map((chunk, chunkIndex) => <div key={chunkIndex}>{chunk.map((sample, sampleIndex) => <Sample key={sampleIndex} index={chunkIndex * chunkSize + sampleIndex} />)}</div>)
						: this.props.tracks.map((sample, sampleIndex) => <Sample key={sampleIndex} index={sampleIndex} />)
					}
				</div>
			)
		}
		else {
			return null // onInit will be called to load tracks
		}
	}
}

// --------------------------------------------------------------

Player.propTypes = {
	audios: PropTypes.array,
	tracks: PropTypes.array,
	samplingStrategyId: PropTypes.string,
	//
	onKeyDown: PropTypes.func,
	onKeyUp: PropTypes.func,
	onInit: PropTypes.func
}

export default Player
