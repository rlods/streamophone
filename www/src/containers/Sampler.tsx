import React, { useCallback } from 'react'
//
import { useSamplerStore, handleKeyDown, handleKeyUp, loadSampler } from '../stores'
import SamplerComponent from '../components/Sampler'

// --------------------------------------------------------------

const Sampler: React.FC = () => {
	const strategyId = useSamplerStore((state) => state.strategyId)
	const tracks = useSamplerStore((state) => state.tracks)

	const onKeyDown = useCallback((e: KeyboardEvent): void => {
		if (!e.repeat) handleKeyDown(e.keyCode)
	}, [])

	const onKeyUp = useCallback((e: KeyboardEvent): void => {
		handleKeyUp(e.keyCode)
	}, [])

	const onInit = useCallback((): void => {
		loadSampler()
	}, [])

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
