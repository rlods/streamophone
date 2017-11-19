import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import AudioRecord from '../tools/AudioRecord'
import ListenSample from '../containers/ListenSample'
import './Listen.css'

// --------------------------------------------------------------

class Listen extends Component {
	componentWillMount() {
		if (!this.props.record)
			this.props.onLoadPlayer()
	}

	render() {
		if (this.props.record) {
			return (
				<div className="listen">
					<div className="listen-actions">
						<button onClick={this.props.record.play.bind(this.props.record)}>LISTEN</button>
					</div>
					<canvas className="listen-timeline" ref={canvas => this.props.record.setCanvas(canvas)} width="400" height="50"></canvas>
					<div className="listen-samples">{this.props.record.data.tracks.map((sample, sampleIndex) => <ListenSample key={sampleIndex} index={sampleIndex} />)}</div>
				</div>
			)
		}
		else {
			return null
		}
	}
}

// --------------------------------------------------------------

Listen.propTypes = {
	record: PropTypes.instanceOf(AudioRecord),
	//
	onLoadPlayer: PropTypes.func
}

export default Listen
