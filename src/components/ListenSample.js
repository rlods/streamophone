import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import './ListenSample.css'

// --------------------------------------------------------------

class ListenSample extends Component {
	render() {
		return (
			<div className="listen-sample">
				<a className="listen-sample-title" target="_blank" rel="noopener noreferrer" href={this.props.url}>{this.props.title}</a>
			</div>
		)
	}
}

// --------------------------------------------------------------

ListenSample.propTypes = {
	title: PropTypes.string,
	url: PropTypes.string
}

export default ListenSample
