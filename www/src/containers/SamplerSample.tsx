import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
//
import { registerSampleCanvas, startSample, stopSample } from '../actions/sampler'
import SamplerSampleComponent from '../components/SamplerSample'
import type { RootState, AppDispatch } from '../types'

// --------------------------------------------------------------

const SOUND_IMG = require('../assets/sound.png')

// --------------------------------------------------------------

interface SamplerSampleProps {
	index: number
	info: string
}

const SamplerSample: React.FC<SamplerSampleProps> = ({ index, info }) => {
	const dispatch = useDispatch<AppDispatch>()
	const track = useSelector((state: RootState) => state.sampler.tracks![index])

	const onMouseDown = useCallback((e: React.MouseEvent): void => {
		if (e.button === 0) dispatch(startSample(index))
	}, [dispatch, index])

	const onMouseUp = useCallback((e: React.MouseEvent): void => {
		if (e.button === 0) dispatch(stopSample(index))
	}, [dispatch, index])

	const onMouseEnter = useCallback((e: React.MouseEvent): void => {
		if (e.buttons) {
			dispatch(startSample(index))
		}
	}, [dispatch, index])

	const onMouseLeave = useCallback((e: React.MouseEvent): void => {
		if (e.buttons) {
			dispatch(stopSample(index))
		}
	}, [dispatch, index])

	const onTouchStart = useCallback((e: React.TouchEvent): void => {
		e.preventDefault()
		dispatch(startSample(index))
	}, [dispatch, index])

	const onTouchEnd = useCallback((e: React.TouchEvent): void => {
		dispatch(stopSample(index))
	}, [dispatch, index])

	const onRegisterCanvas = useCallback((canvas: HTMLCanvasElement | null): void => {
		dispatch(registerSampleCanvas(index, canvas))
	}, [dispatch, index])

	return (
		<SamplerSampleComponent
			bpm={Math.floor(track.bpm)}
			cover={track.cover || SOUND_IMG}
			info={info}
			normalized={track.normalized}
			playing={track.playing}
			ready={track.ready}
			speed={track.speed.toFixed(2)}
			title={track.title}
			url={track.url}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			onRegisterCanvas={onRegisterCanvas}
		/>
	)
}

export default SamplerSample
