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
				<button onClick={this.props.record.play.bind(this.props.record)}>LISTEN</button>
			</div>
		)
	}
}

// --------------------------------------------------------------

Listen.propTypes = {
	record: PropTypes.instanceOf(AudioRecord)
}

export default Listen
