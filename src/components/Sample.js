import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// --------------------------------------------------------------

class Sample extends Component {
	render() {
		// props.info is given for the keyboard strategy to display keycode
		const info = this.props.info ? <div className="sample-info">{this.props.info}</div> : null
		return (
			<div className={classNames('sample', { playing: this.props.playing })}>
				<img className="sample-cover" src={this.props.cover} alt={this.props.title} />
				{info}
				<a href={this.props.url} target="_blank" className="sample-title">{this.props.title}</a>
			</div>
		)
	}
}

// --------------------------------------------------------------

Sample.propTypes = {
	cover: PropTypes.string,
	playing: PropTypes.bool,
	title: PropTypes.string,
	url: PropTypes.string
}

export default Sample
