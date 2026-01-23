import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, NavigateFunction } from 'react-router-dom'
//
import { changeSamplerDefaultDuration, changeSamplerStrategy } from '../actions/sampler'
import { changeSourceBPM, changeSourceId, changeSourceTransformation, changeSourceType } from '../actions/source'
import { goToSampler } from '../actions/sampler'
import SplashComponent from '../components/Splash'
import type { RootState, AppDispatch } from '../types'

// --------------------------------------------------------------

const Splash: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const navigate: NavigateFunction = useNavigate()

	const samplerDefaultDuration = useSelector((state: RootState) => state.sampler.defaultDuration)
	const samplerStrategyId = useSelector((state: RootState) => state.sampler.strategyId)
	const sourceBPM = useSelector((state: RootState) => state.source.bpm)
	const sourceId = useSelector((state: RootState) => state.source.id)
	const sourceTransformation = useSelector((state: RootState) => state.source.transformation)
	const sourceType = useSelector((state: RootState) => state.source.type)

	const onChangeCurated = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		const [sourceType, sourceId] = e.target.value.split(':')
		dispatch(changeSourceId(sourceId))
		dispatch(changeSourceType(sourceType))
	}, [dispatch])

	const onChangeSamplerDefaultDuration = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		dispatch(changeSamplerDefaultDuration(parseInt(e.target.value, 10)))
	}, [dispatch])

	const onChangeSamplerStrategy = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		dispatch(changeSamplerStrategy(e.target.value))
	}, [dispatch])

	const onChangeSourceBPM = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		dispatch(changeSourceBPM(parseInt(e.target.value, 10)))
	}, [dispatch])

	const onChangeSourceId = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
		dispatch(changeSourceId(e.target.value))
	}, [dispatch])

	const onChangeSourceTransformation = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		dispatch(changeSourceTransformation(e.target.value))
	}, [dispatch])

	const onChangeSourceType = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		dispatch(changeSourceType(e.target.value))
	}, [dispatch])

	const onCreate = useCallback((e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		dispatch(goToSampler(navigate))
	}, [dispatch, navigate])

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
