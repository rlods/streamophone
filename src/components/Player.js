import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import Samples from '../containers/Sampling'
import './Player.css'

// --------------------------------------------------------------

class Player extends Component {
	componentWillMount(){
		document.addEventListener("keydown", this.props.onKeyDown.bind(this))
		document.addEventListener("keyup", this.props.onKeyUp.bind(this))
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.props.onKeyDown.bind(this))
		document.addEventListener("keyup", this.props.onKeyUp.bind(this))
	}

	render() {
		return (
			<div className="player">
				<Samples />
			</div>
		)
	}
}

// --------------------------------------------------------------

Player.propTypes = {
	onKeyDown: PropTypes.func,
	onKeyUp: PropTypes.func
}

export default Player
