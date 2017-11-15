import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// --------------------------------------------------------------

class Sample extends Component {
	render() {
		// props.info is given for the keyboard strategy to display keycode
		const info = this.props.info ? <div className="sample-info">{this.props.info}</div> : null
		const meta = (
			<div className="sample-metas">
				{this.props.bpm ? <i className="sample-meta">{this.props.bpm}</i> : null}
				{this.props.normalized ? <i className="fa fa-bolt sample-meta"></i> : null}
				{this.props.ready ? <i className="fa fa-thumbs-up sample-meta"></i> : <i className="fa fa-thumbs-down sample-meta"></i>}
			</div>
		)
		return (
			<div className={classNames('sample', { playing: this.props.playing })}>
				<img className="sample-cover" src={this.props.cover} alt={this.props.title} />
				{info}
				{meta}
				<a href={this.props.url} target="_blank" className="sample-title">{this.props.title}</a>
			</div>
		)
	}
}

// --------------------------------------------------------------

Sample.propTypes = {
	bpm: PropTypes.number,
	cover: PropTypes.string,
	normalized: PropTypes.bool,
	playing: PropTypes.bool,
	ready: PropTypes.bool,
	title: PropTypes.string,
	url: PropTypes.string
}

export default Sample
