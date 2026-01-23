import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import './SamplerSample.css'

// --------------------------------------------------------------

const SamplerSample = ({
	bpm,
	cover,
	info,
	normalized,
	playing,
	ready,
	speed,
	title,
	url,
	onMouseDown,
	onMouseUp,
	onMouseEnter,
	onMouseLeave,
	onTouchStart,
	onTouchEnd,
	onRegisterCanvas
}) => {
	// props.info is given for the keyboard strategy to display keycode
	const canvas = playing ? <canvas className="sampler-sample-canvas" width="300" height="300" ref={canvas => onRegisterCanvas(canvas)}></canvas> : null
	const infoElement = info ? <div className="sampler-sample-info">{info}</div> : null
	const meta = (
		<div className="sampler-sample-metas">
			{bpm ? <i className="sampler-sample-meta sampler-sample-meta-bpm">{bpm}</i> : null}
			{Math.abs(speed - 1.0) > Number.EPSILON ? <i className="sampler-sample-meta sampler-sample-meta-spped">{speed}</i> : null}
			{normalized ? <i className="fa fa-bolt sampler-sample-meta sampler-sample-meta-normalized" title="normalized"></i> : null}
			{ready ? null : <i className="fa fa-exclamation-triangle sampler-sample-meta sampler-sample-meta-notready" title="not ready"></i>}
		</div>
	)
	const menu = true ? null : (
		<div className="sampler-sample-menu">TEST</div>
	)

	return (
		<div
			className={classNames('sampler-sample', { playing })}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}>
			<img className="sampler-sample-cover" src={cover} alt={title} />
			{canvas}
			{infoElement}
			{meta}
			{menu}
			<a href={url} target="_blank" rel="noopener noreferrer" className="sampler-sample-title">{title}</a>
		</div>
	)
}

// --------------------------------------------------------------

SamplerSample.propTypes = {
	bpm: PropTypes.number,
	cover: PropTypes.string,
	info: PropTypes.string,
	normalized: PropTypes.bool,
	playing: PropTypes.bool,
	ready: PropTypes.bool,
	speed: PropTypes.string,
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
