import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
//
import { changeSamplerDefaultDuration, changeSamplerStrategy } from '../actions/sampler'
import { changeSourceBPM, changeSourceId, changeSourceTransformation, changeSourceType } from '../actions/source'
import { goToSampler } from '../actions/sampler'
import SplashComponent from '../components/Splash'

// --------------------------------------------------------------

const Splash = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const samplerDefaultDuration = useSelector(state => state.sampler.defaultDuration)
	const samplerStrategyId = useSelector(state => state.sampler.strategyId)
	const sourceBPM = useSelector(state => state.source.bpm)
	const sourceId = useSelector(state => state.source.id)
	const sourceTransformation = useSelector(state => state.source.transformation)
	const sourceType = useSelector(state => state.source.type)

	const onChangeCurated = useCallback(e => {
		const [sourceType, sourceId] = e.target.value.split(':')
		dispatch(changeSourceId(sourceId))
		dispatch(changeSourceType(sourceType))
	}, [dispatch])

	const onChangeSamplerDefaultDuration = useCallback(e => dispatch(changeSamplerDefaultDuration(parseInt(e.target.value, 10))), [dispatch])
	const onChangeSamplerStrategy = useCallback(e => dispatch(changeSamplerStrategy(e.target.value)), [dispatch])
	const onChangeSourceBPM = useCallback(e => dispatch(changeSourceBPM(parseInt(e.target.value, 10))), [dispatch])
	const onChangeSourceId = useCallback(e => dispatch(changeSourceId(e.target.value)), [dispatch])
	const onChangeSourceTransformation = useCallback(e => dispatch(changeSourceTransformation(e.target.value)), [dispatch])
	const onChangeSourceType = useCallback(e => dispatch(changeSourceType(e.target.value)), [dispatch])

	const onCreate = useCallback(e => {
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
