import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
//
import { handleKeyDown, handleKeyUp, loadSampler } from '../actions/sampler'
import SamplerComponent from '../components/Sampler'

// --------------------------------------------------------------

const Sampler = () => {
	const dispatch = useDispatch()

	const strategyId = useSelector(state => state.sampler.strategyId)
	const tracks = useSelector(state => state.sampler.tracks)

	const onKeyDown = useCallback(e => !e.repeat && dispatch(handleKeyDown(e.keyCode)), [dispatch])
	const onKeyUp = useCallback(e => dispatch(handleKeyUp(e.keyCode)), [dispatch])
	const onInit = useCallback(() => dispatch(loadSampler()), [dispatch])

	return (
		<SamplerComponent
			strategyId={strategyId}
			tracks={tracks}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			onInit={onInit}
		/>
	)
}

export default Sampler
