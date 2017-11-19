import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import './SamplerSample.css'

// --------------------------------------------------------------

class SamplerSample extends Component {
	render() {
		// props.info is given for the keyboard strategy to display keycode
		const canvas = this.props.playing ? <canvas className="sampler-sample-canvas" width="300" height="300" ref={canvas => this.props.onRegisterCanvas(canvas)}></canvas> : null
		const info = this.props.info ? <div className="sampler-sample-info">{this.props.info}</div> : null
		const meta = (
			<div className="sampler-sample-metas">
				{this.props.bpm ? <i className="sampler-sample-meta sampler-sample-meta-bpm">{this.props.bpm}</i> : null}
				{Math.abs(this.props.speed - 1.0) > Number.EPSILON ? <i className="sampler-sample-meta sampler-sample-meta-spped">{this.props.speed}</i> : null}
				{this.props.normalized ? <i className="fa fa-bolt sampler-sample-meta sampler-sample-meta-normalized" title="normalized"></i> : null}
				{this.props.ready ? null : <i className="fa fa-exclamation-triangle sampler-sample-meta sampler-sample-meta-notready" title="not ready"></i>}
			</div>
		)
		const menu = true ? null : (
			<div className="sampler-sample-menu">TEST</div>
		)

		return (
			<div
				className={classNames('sampler-sample', { playing: this.props.playing })}
				onMouseDown={this.props.onMouseDown}
				onMouseUp={this.props.onMouseUp}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}
				onTouchStart={this.props.onTouchStart}
				onTouchEnd={this.props.onTouchEnd}>
				<img className="sampler-sample-cover" src={this.props.cover} alt={this.props.title} />
				{canvas}
				{info}
				{meta}
				{menu}
				<a href={this.props.url} target="_blank" rel="noopener noreferrer" className="sampler-sample-title">{this.props.title}</a>
			</div>
		)
	}
}

// --------------------------------------------------------------

SamplerSample.propTypes = {
	bpm: PropTypes.number,
	cover: PropTypes.string,
	normalized: PropTypes.bool,
	playing: PropTypes.bool,
	ready: PropTypes.bool,
	title: PropTypes.string,
	url: PropTypes.string,
	//
	onMouseDown: PropTypes.func,
	onMouseUp: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onTouchStart: PropTypes.func,
	onTouchEnd: PropTypes.func,
	onRegisterCanvas: PropTypes.func
}

export default SamplerSample
