import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
//
import { handleKeyDown, handleKeyUp, loadSampler } from '../actions/sampler'
import SamplerComponent from '../components/Sampler'
import type { RootState, AppDispatch } from '../types'

// --------------------------------------------------------------

const Sampler: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()

	const strategyId = useSelector((state: RootState) => state.sampler.strategyId)
	const tracks = useSelector((state: RootState) => state.sampler.tracks)

	const onKeyDown = useCallback((e: KeyboardEvent): void => {
		if (!e.repeat) dispatch(handleKeyDown(e.keyCode))
	}, [dispatch])

	const onKeyUp = useCallback((e: KeyboardEvent): void => {
		dispatch(handleKeyUp(e.keyCode))
	}, [dispatch])

	const onInit = useCallback((): void => {
		dispatch(loadSampler())
	}, [dispatch])

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
