import type { Reducer } from 'redux'
import config from '../config'
import { getSearchParam } from '../tools'
import type { SamplerState, Track, AppAction } from '../types'

// ------------------------------------------------------------------

// Action data types for sampler actions
interface SetSampleBPMData {
	sampleIndex: number
	bpm: number
}

interface SetSampleDefaultDurationData {
	defaultDuration: number
}

interface SetSampleNormalizationVolumeData {
	sampleIndex: number
	volume: number
}

interface SetSampleReadyData {
	sampleIndex: number
}

interface SetSampleSpeedData {
	sampleIndex: number
	speed: number
}

interface SetSampleStatusData {
	playing: boolean
	sampleIndex: number
}

interface SetSampleVolumeData {
	sampleIndex: number
	volume: number
}

interface SetSamplesData {
	tracks: Track[]
}

interface SetSamplerStatusData {
	started: boolean
}

interface SetStrategyData {
	strategyId: string
}

// ------------------------------------------------------------------

const getInitialDuration = (): number => {
	const param = getSearchParam('sampler_duration')
	const stored = sessionStorage.getItem('DEFAULT_SAMPLER_DURATION')
	const value = param || stored || config.DEFAULT.SAMPLER_DURATION
	return typeof value === 'string' ? parseInt(value, 10) : value
}

const getInitialStrategy = (): string => {
	const param = getSearchParam('sampler_strategy')
	const stored = sessionStorage.getItem('DEFAULT_SAMPLER_STRATEGY')
	return (param || stored || config.DEFAULT.SAMPLER_STRATEGY) as string
}

const INITIAL_STATE: SamplerState = {
	started: false,
	tracks: null,
	defaultDuration: getInitialDuration(),
	strategyId: getInitialStrategy()
}

// ------------------------------------------------------------------

const setSampleBPM = (state: SamplerState, { sampleIndex, bpm }: SetSampleBPMData): SamplerState =>
	({
		...state,
		tracks: state.tracks?.map((other, otherIndex) =>
			otherIndex !== sampleIndex ? other : { ...other, bpm }
		) ?? null
	})

const setSampleDefaultDuration = (state: SamplerState, { defaultDuration }: SetSampleDefaultDurationData): SamplerState =>
	({ ...state, defaultDuration })

const setSampleNormalizationVolume = (state: SamplerState, { sampleIndex, volume }: SetSampleNormalizationVolumeData): SamplerState =>
	({
		...state,
		tracks: state.tracks?.map((other, otherIndex) =>
			otherIndex !== sampleIndex ? other : { ...other, volume1: volume, normalized: true }
		) ?? null
	})

const setSampleReady = (state: SamplerState, { sampleIndex }: SetSampleReadyData): SamplerState =>
	({
		...state,
		tracks: state.tracks?.map((other, otherIndex) =>
			otherIndex !== sampleIndex ? other : { ...other, ready: true }
		) ?? null
	})

const setSampleSpeed = (state: SamplerState, { sampleIndex, speed }: SetSampleSpeedData): SamplerState =>
	({
		...state,
		tracks: state.tracks?.map((other, otherIndex) =>
			otherIndex !== sampleIndex ? other : { ...other, speed }
		) ?? null
	})

const setSampleStatus = (state: SamplerState, { playing, sampleIndex }: SetSampleStatusData): SamplerState =>
	({
		...state,
		tracks: state.tracks?.map((other, otherIndex) =>
			otherIndex !== sampleIndex ? other : { ...other, playing }
		) ?? null
	})

const setSampleVolume = (state: SamplerState, { sampleIndex, volume }: SetSampleVolumeData): SamplerState =>
	({
		...state,
		tracks: state.tracks?.map((other, otherIndex) =>
			otherIndex !== sampleIndex ? other : { ...other, volume2: volume }
		) ?? null
	})

const setSamples = (state: SamplerState, { tracks }: SetSamplesData): SamplerState =>
	({ ...state, tracks })

const setSamplerStatus = (state: SamplerState, { started }: SetSamplerStatusData): SamplerState =>
	({ ...state, started })

const setStrategy = (state: SamplerState, { strategyId }: SetStrategyData): SamplerState =>
	({ ...state, strategyId })

// ------------------------------------------------------------------

const samplerReducer: Reducer<SamplerState, AppAction> = (
	state: SamplerState = INITIAL_STATE,
	action: AppAction
): SamplerState => {
	switch (action.type) {
	case 'SAMPLER_SET_SAMPLE_BPM':
		return setSampleBPM(state, action.data as SetSampleBPMData)
	case 'SAMPLER_SET_DEFAULT_DURATION':
		return setSampleDefaultDuration(state, action.data as SetSampleDefaultDurationData)
	case 'SAMPLER_SET_SAMPLE_NORMALIZATION_VOLUME':
		return setSampleNormalizationVolume(state, action.data as SetSampleNormalizationVolumeData)
	case 'SAMPLER_SET_SAMPLE_READY':
		return setSampleReady(state, action.data as SetSampleReadyData)
	case 'SAMPLER_SET_SAMPLE_SPEED':
		return setSampleSpeed(state, action.data as SetSampleSpeedData)
	case 'SAMPLER_SET_SAMPLE_STATUS':
		return setSampleStatus(state, action.data as SetSampleStatusData)
	case 'SAMPLER_SET_SAMPLE_VOLUME':
		return setSampleVolume(state, action.data as SetSampleVolumeData)
	case 'SAMPLER_SET_SAMPLES':
		return setSamples(state, action.data as SetSamplesData)
	case 'SAMPLER_SET_STATUS':
		return setSamplerStatus(state, action.data as SetSamplerStatusData)
	case 'SAMPLER_SET_STRATEGY':
		return setStrategy(state, action.data as SetStrategyData)
	default:
		return state
	}
}

export default samplerReducer
