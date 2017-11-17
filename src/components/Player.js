import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import { chunkArray } from '../tools'
import Sample from '../containers/Sample'
import './Player.css'

// --------------------------------------------------------------

const KEY_ORDER_AZERTY = 'AZERTYUIOPQSDFGHJKLMWXCVBN'

// --------------------------------------------------------------

class Player extends Component {
	componentWillMount() {
		document.addEventListener('keydown', this.props.onKeyDown.bind(this))
		document.addEventListener('keyup', this.props.onKeyUp.bind(this))
		if (!this.props.tracks)	
			this.props.onInit() // Because user directly opened the /play page not from the splash screen
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.props.onKeyDown.bind(this))
		document.addEventListener('keyup', this.props.onKeyUp.bind(this))
	}

	render() {
		if (null !== this.props.tracks) {
			let chunkSize, body, layoutClassName = this.props.samplingStrategyId
			switch (this.props.samplingStrategyId)
			{
				case 'KEYBOARD_AZERTY':
				case 'KEYBOARD_QWERTY':
					const rows = [
						this.props.tracks.slice(0, 10),
						this.props.tracks.slice(10, 20),
						this.props.tracks.slice(20)
					]
					layoutClassName = 'KEYBOARD'
					body = rows.map((row, rowIndex) => <div className="samples-group samples-group-by-row" key={rowIndex}>{row.map((sample, sampleIndex) => <Sample key={sampleIndex} index={rowIndex * 10 + sampleIndex} info={KEY_ORDER_AZERTY[rowIndex * 10 + sampleIndex]} />)}</div>)
					break

				case 'BCF2000_MULTISLIDERS':
					chunkSize = Math.floor(this.props.tracks.length / 8)
					body = chunkArray(this.props.tracks, chunkSize).map((chunk, chunkIndex) => <div className="samples-group samples-group-by-col" key={chunkIndex}>{chunk.map((sample, sampleIndex) => <Sample key={sampleIndex} index={chunkIndex * chunkSize + sampleIndex} />)}</div>)
					break

				case 'LIGHTPADBLOCK_4':
				case 'LIGHTPADBLOCK_16':
					layoutClassName = 'LIGHTPADBLOCK'
					chunkSize = Math.sqrt(this.props.tracks.length)
					body = chunkArray(this.props.tracks, chunkSize).map((chunk, chunkIndex) => <div className="samples-group samples-group-by-row" key={chunkIndex}>{chunk.map((sample, sampleIndex) => <Sample key={sampleIndex} index={chunkIndex * chunkSize + sampleIndex} />)}</div>)
					break

				case 'CUSTOM_SOCKET_STRATEGY':
					chunkSize = Math.floor(this.props.tracks.length / 5)
					body = chunkArray(this.props.tracks, chunkSize).map((chunk, chunkIndex) => <div className="samples-group samples-group-by-col" key={chunkIndex}>{chunk.map((sample, sampleIndex) => <Sample key={sampleIndex} index={chunkIndex * chunkSize + sampleIndex} />)}</div>)
					break

				case 'KORG_NANOKEY2':
					body = [
						<div className="samples-group samples-group-by-row">
							<Sample index={1} />
							<Sample index={3} />
							<Sample index={6} />
							<Sample index={8} />
							<Sample index={10} />
							<Sample index={13} />
							<Sample index={15} />
							<Sample index={18} />
							<Sample index={20} />
							<Sample index={22} />
						</div>,
						<div className="samples-group samples-group-by-row">
							<Sample index={0} />
							<Sample index={2} />
							<Sample index={4} />
							<Sample index={5} />
							<Sample index={7} />
							<Sample index={9} />
							<Sample index={11} />
							<Sample index={12} />
							<Sample index={14} />
							<Sample index={16} />
							<Sample index={17} />
							<Sample index={19} />
							<Sample index={21} />
							<Sample index={23} />
							<Sample index={24} />
						</div>
					]
					break

				default:
					body = this.props.tracks.map((sample, sampleIndex) => <Sample key={sampleIndex} index={sampleIndex} />)
					break
			}

			const info = true ? null : (
				<div className="player-info">TEST</div>
			)

			return (
				<div className={classNames('player', this.props.samplingStrategyId, layoutClassName)}>
					{info}
					{body}
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
