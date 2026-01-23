import React, { useCallback } from 'react'
//
import { useSamplerStore, registerSampleCanvas, startSample, stopSample } from '../stores'
import SamplerSampleComponent from '../components/SamplerSample'

// --------------------------------------------------------------

const SOUND_IMG = require('../assets/sound.png')

// --------------------------------------------------------------

interface SamplerSampleProps {
	index: number
	info: string
}

const SamplerSample: React.FC<SamplerSampleProps> = ({ index, info }) => {
	const track = useSamplerStore((state) => state.tracks![index])

	const onMouseDown = useCallback((e: React.MouseEvent): void => {
		if (e.button === 0) startSample(index)
	}, [index])

	const onMouseUp = useCallback((e: React.MouseEvent): void => {
		if (e.button === 0) stopSample(index)
	}, [index])

	const onMouseEnter = useCallback((e: React.MouseEvent): void => {
		if (e.buttons) {
			startSample(index)
		}
	}, [index])

	const onMouseLeave = useCallback((e: React.MouseEvent): void => {
		if (e.buttons) {
			stopSample(index)
		}
	}, [index])

	const onTouchStart = useCallback((e: React.TouchEvent): void => {
		e.preventDefault()
		startSample(index)
	}, [index])

	const onTouchEnd = useCallback((): void => {
		stopSample(index)
	}, [index])

	const onRegisterCanvas = useCallback((canvas: HTMLCanvasElement | null): void => {
		registerSampleCanvas(index, canvas)
	}, [index])

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
