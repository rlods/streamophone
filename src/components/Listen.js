import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import AudioRecord from '../tools/AudioRecord'
import './Listen.css'

// --------------------------------------------------------------

class Listen extends Component {
	render() {
		return (
			<div className="listen">
				<div className="actions">
					<button onClick={this.props.record.play.bind(this.props.record)}>LISTEN</button>
				</div>
				<canvas className="timeline"></canvas>
				<div className="tracks">
				{
					Object.values(this.props.record.data.tracks).map(track => (
						<div className="track">
							<a className="track-title" href={track.url}>{track.title}</a>
						</div>
					))
				}
				</div>
			</div>
		)
	}
}

// --------------------------------------------------------------

Listen.propTypes = {
	record: PropTypes.instanceOf(AudioRecord)
}

export default Listen
