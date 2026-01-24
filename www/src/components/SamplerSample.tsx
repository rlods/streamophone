import { FC, MouseEvent, ReactNode, useCallback } from 'react'
import classNames from 'classnames'
//
import { useSamplerStore, registerSampleCanvas, startSample, stopSample } from '../stores'
import './SamplerSample.css'

// --------------------------------------------------------------

const SOUND_IMG = require('../assets/sound.png')

// --------------------------------------------------------------

interface SamplerSampleProps {
	index: number
	info?: string
}

const SamplerSample: FC<SamplerSampleProps> = ({ index, info }) => {
	const track = useSamplerStore((state) => state.tracks![index])

	const onMouseDown = useCallback((e: MouseEvent): void => {
		if (e.button === 0) startSample(index)
	}, [index])

	const onMouseUp = useCallback((e: MouseEvent): void => {
		if (e.button === 0) stopSample(index)
	}, [index])

	const onMouseEnter = useCallback((e: MouseEvent): void => {
		if (e.buttons) {
			startSample(index)
		}
	}, [index])

	const onMouseLeave = useCallback((e: MouseEvent): void => {
		if (e.buttons) {
			stopSample(index)
		}
	}, [index])

	const onTouchStart = useCallback((e: TouchEvent): void => {
		e.preventDefault()
		startSample(index)
	}, [index])

	const onTouchEnd = useCallback((): void => {
		stopSample(index)
	}, [index])

	const onRegisterCanvas = useCallback((canvas: HTMLCanvasElement | null): void => {
		registerSampleCanvas(index, canvas)
	}, [index])

	const bpm = Math.floor(track.bpm ?? 0)
	const cover = track.cover || SOUND_IMG
	const speed = track.speed.toFixed(2)

	// props.info is given for the keyboard strategy to display keycode
	const canvas: ReactNode = track.playing ? <canvas className="sampler-sample-canvas" width="300" height="300" ref={onRegisterCanvas}></canvas> : null
	const infoElement: ReactNode = info ? <div className="sampler-sample-info">{info}</div> : null
	const meta: ReactNode = (
		<div className="sampler-sample-metas">
			{bpm ? <i className="sampler-sample-meta sampler-sample-meta-bpm">{bpm}</i> : null}
			{Math.abs(track.speed - 1.0) > Number.EPSILON ? <i className="sampler-sample-meta sampler-sample-meta-spped">{speed}</i> : null}
			{track.normalized ? <i className="fa fa-bolt sampler-sample-meta sampler-sample-meta-normalized" title="normalized"></i> : null}
			{track.ready ? null : <i className="fa fa-exclamation-triangle sampler-sample-meta sampler-sample-meta-notready" title="not ready"></i>}
		</div>
	)
	const menu: ReactNode = true ? null : (
		<div className="sampler-sample-menu">TEST</div>
	)

	return (
		<div
			className={classNames('sampler-sample', { playing: track.playing })}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}>
			<img className="sampler-sample-cover" src={cover} alt={track.title} />
			{canvas}
			{infoElement}
			{meta}
			{menu}
			<a href={track.url} target="_blank" rel="noopener noreferrer" className="sampler-sample-title">{track.title}</a>
		</div>
	)
}

// --------------------------------------------------------------

export default SamplerSample
