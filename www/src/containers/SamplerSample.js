import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
//
import { registerSampleCanvas, startSample, stopSample } from '../actions/sampler'
import SamplerSampleComponent from '../components/SamplerSample'

// --------------------------------------------------------------

const SOUND_IMG = require('../assets/sound.png')

// --------------------------------------------------------------

const SamplerSample = ({ index, info }) => {
	const dispatch = useDispatch()
	const track = useSelector(state => state.sampler.tracks[index])

	const onMouseDown = useCallback(e => {
		if (e.button === 0) dispatch(startSample(index))
	}, [dispatch, index])

	const onMouseUp = useCallback(e => {
		if (e.button === 0) dispatch(stopSample(index))
	}, [dispatch, index])

	const onMouseEnter = useCallback(e => {
		if (e.buttons) {
			dispatch(startSample(index))
		}
	}, [dispatch, index])

	const onMouseLeave = useCallback(e => {
		if (e.buttons) {
			dispatch(stopSample(index))
		}
	}, [dispatch, index])

	const onTouchStart = useCallback(e => {
		e.preventDefault()
		dispatch(startSample(index))
	}, [dispatch, index])

	const onTouchEnd = useCallback(e => {
		dispatch(stopSample(index))
	}, [dispatch, index])

	const onRegisterCanvas = useCallback(canvas => {
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
