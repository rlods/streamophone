import React, { useCallback } from 'react'
import { useNavigate, NavigateFunction } from 'react-router-dom'
//
import { useSamplerStore, useSourceStore, goToSampler } from '../stores'
import SplashComponent from '../components/Splash'

// --------------------------------------------------------------

const Splash: React.FC = () => {
	const navigate: NavigateFunction = useNavigate()

	const samplerDefaultDuration = useSamplerStore((state) => state.defaultDuration)
	const samplerStrategyId = useSamplerStore((state) => state.strategyId)
	const setDefaultDuration = useSamplerStore((state) => state.setDefaultDuration)
	const setStrategy = useSamplerStore((state) => state.setStrategy)

	const sourceBPM = useSourceStore((state) => state.bpm)
	const sourceId = useSourceStore((state) => state.id)
	const sourceTransformation = useSourceStore((state) => state.transformation)
	const sourceType = useSourceStore((state) => state.type)
	const setBpm = useSourceStore((state) => state.setBpm)
	const setId = useSourceStore((state) => state.setId)
	const setTransformation = useSourceStore((state) => state.setTransformation)
	const setType = useSourceStore((state) => state.setType)

	const onChangeCurated = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		const [sourceType, sourceId] = e.target.value.split(':')
		setId(sourceId)
		setType(sourceType)
	}, [setId, setType])

	const onChangeSamplerDefaultDuration = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setDefaultDuration(parseInt(e.target.value, 10))
	}, [setDefaultDuration])

	const onChangeSamplerStrategy = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setStrategy(e.target.value)
	}, [setStrategy])

	const onChangeSourceBPM = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setBpm(parseInt(e.target.value, 10))
	}, [setBpm])

	const onChangeSourceId = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
		setId(e.target.value)
	}, [setId])

	const onChangeSourceTransformation = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setTransformation(e.target.value)
	}, [setTransformation])

	const onChangeSourceType = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setType(e.target.value)
	}, [setType])

	const onCreate = useCallback((e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		goToSampler(navigate)
	}, [navigate])

	return (
		<SplashComponent
			samplerDefaultDuration={samplerDefaultDuration}
			samplerStrategyId={samplerStrategyId}
			sourceBPM={sourceBPM}
			sourceId={sourceId}
			sourceTransformation={sourceTransformation}
			sourceType={sourceType}
			onChangeCurated={onChangeCurated}
			onChangeSamplerDefaultDuration={onChangeSamplerDefaultDuration}
			onChangeSamplerStrategy={onChangeSamplerStrategy}
			onChangeSourceBPM={onChangeSourceBPM}
			onChangeSourceId={onChangeSourceId}
			onChangeSourceTransformation={onChangeSourceTransformation}
			onChangeSourceType={onChangeSourceType}
			onCreate={onCreate}
		/>
	)
}

export default Splash
