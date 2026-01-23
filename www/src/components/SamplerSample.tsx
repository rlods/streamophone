import React from 'react'
import classNames from 'classnames'
//
import './SamplerSample.css'

// --------------------------------------------------------------

interface SamplerSampleProps {
	bpm?: number
	cover?: string
	info?: string
	normalized?: boolean
	playing: boolean
	ready: boolean
	speed: number
	title: string
	url: string
	onMouseDown: () => void
	onMouseUp: () => void
	onMouseEnter: () => void
	onMouseLeave: () => void
	onTouchStart: () => void
	onTouchEnd: () => void
	onRegisterCanvas: (canvas: HTMLCanvasElement | null) => void
}

const SamplerSample: React.FC<SamplerSampleProps> = ({
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
	const canvas: React.ReactNode = playing ? <canvas className="sampler-sample-canvas" width="300" height="300" ref={(canvas: HTMLCanvasElement | null) => onRegisterCanvas(canvas)}></canvas> : null
	const infoElement: React.ReactNode = info ? <div className="sampler-sample-info">{info}</div> : null
	const meta: React.ReactNode = (
		<div className="sampler-sample-metas">
			{bpm ? <i className="sampler-sample-meta sampler-sample-meta-bpm">{bpm}</i> : null}
			{Math.abs(speed - 1.0) > Number.EPSILON ? <i className="sampler-sample-meta sampler-sample-meta-spped">{speed}</i> : null}
			{normalized ? <i className="fa fa-bolt sampler-sample-meta sampler-sample-meta-normalized" title="normalized"></i> : null}
			{ready ? null : <i className="fa fa-exclamation-triangle sampler-sample-meta sampler-sample-meta-notready" title="not ready"></i>}
		</div>
	)
	const menu: React.ReactNode = true ? null : (
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

export default SamplerSample
