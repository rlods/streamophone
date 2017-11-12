import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// --------------------------------------------------------------

class Sample extends Component {
	render() {
		return (
			<div className={classNames('sample', { playing: this.props.playing })}>
				<img className="sample-cover" src={this.props.cover} alt={this.props.title} />
				<div className="sample-info">{this.props.title}</div>
			</div>
		)
	}
}

// --------------------------------------------------------------

Sample.propTypes = {
	cover: PropTypes.string,
	playing: PropTypes.bool,
	title: PropTypes.string
}

export default Sample
