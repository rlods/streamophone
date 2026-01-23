import type { Reducer } from 'redux'
import config from '../config'
import { getSearchParam } from '../tools'
import type { SourceState, AppAction } from '../types'

// ------------------------------------------------------------------

// Action data types for source actions
interface SetSourceBPMData {
	bpm: number
}

interface SetSourceIdData {
	id: string
}

interface SetSourceTransformationData {
	transformation: string
}

interface SetSourceTypeData {
	type: string
}

// ------------------------------------------------------------------

const getInitialBpm = (): number => {
	const param = getSearchParam('source_bpm')
	const stored = sessionStorage.getItem('DEFAULT_SOURCE_BPM')
	const value = param || stored || config.DEFAULT.SOURCE_BPM
	return typeof value === 'string' ? parseInt(value, 10) : value
}

const getInitialId = (): string => {
	const param = getSearchParam('source_id')
	const stored = sessionStorage.getItem('DEFAULT_SOURCE_ID')
	return (param || stored || config.DEFAULT.SOURCE_ID) as string
}

const getInitialTransformation = (): string => {
	const param = getSearchParam('source_transformation')
	const stored = sessionStorage.getItem('DEFAULT_SOURCE_TRANSFORMATION')
	return (param || stored || config.DEFAULT.SOURCE_TRANSFORMATION) as string
}

const getInitialType = (): string => {
	const param = getSearchParam('source_type')
	const stored = sessionStorage.getItem('DEFAULT_SOURCE_TYPE')
	return (param || stored || config.DEFAULT.SOURCE_TYPE) as string
}

const INITIAL_STATE: SourceState = {
	bpm: getInitialBpm(),
	id: getInitialId(),
	transformation: getInitialTransformation(),
	type: getInitialType()
}

// ------------------------------------------------------------------

const setSourceBPM = (state: SourceState, { bpm }: SetSourceBPMData): SourceState =>
	({ ...state, bpm })

const setSourceId = (state: SourceState, { id }: SetSourceIdData): SourceState =>
	({ ...state, id })

const setSourceTransformation = (state: SourceState, { transformation }: SetSourceTransformationData): SourceState =>
	({ ...state, transformation })

const setSourceType = (state: SourceState, { type }: SetSourceTypeData): SourceState =>
	({ ...state, type })

// ------------------------------------------------------------------

const sourceReducer: Reducer<SourceState, AppAction> = (
	state: SourceState = INITIAL_STATE,
	action: AppAction
): SourceState => {
	switch (action.type) {
	case 'SOURCE_SET_BPM':
		return setSourceBPM(state, action.data as SetSourceBPMData)
	case 'SOURCE_SET_ID':
		return setSourceId(state, action.data as SetSourceIdData)
	case 'SOURCE_SET_TRANSFORMATION':
		return setSourceTransformation(state, action.data as SetSourceTransformationData)
	case 'SOURCE_SET_TYPE':
		return setSourceType(state, action.data as SetSourceTypeData)
	default:
		return state
	}
}

export default sourceReducer
