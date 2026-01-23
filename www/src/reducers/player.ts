import type { Reducer } from 'redux'
import type { PlayerState, Track, AppAction } from '../types'

// ------------------------------------------------------------------

// Action data types for player actions
interface SetSampleReadyData {
	sampleIndex: number
}

interface SetSampleStatusData {
	playing: boolean
	sampleIndex: number
}

interface SetSamplesData {
	tracks: Track[]
}

interface SetStatusData {
	playing: boolean
}

// ------------------------------------------------------------------

const INITIAL_STATE: PlayerState = {
	playing: false,
	tracks: null
}

// ------------------------------------------------------------------

const setSampleReady = (state: PlayerState, { sampleIndex }: SetSampleReadyData): PlayerState =>
	({
		...state,
		tracks: state.tracks?.map((other, otherIndex) =>
			otherIndex !== sampleIndex ? other : { ...other, ready: true }
		) ?? null
	})

const setSampleStatus = (state: PlayerState, { playing, sampleIndex }: SetSampleStatusData): PlayerState =>
	({
		...state,
		tracks: state.tracks?.map((other, otherIndex) =>
			otherIndex !== sampleIndex ? other : { ...other, playing }
		) ?? null
	})

const setSamples = (state: PlayerState, { tracks }: SetSamplesData): PlayerState =>
	({ ...state, tracks })

const setStatus = (state: PlayerState, { playing }: SetStatusData): PlayerState =>
	({ ...state, playing })

// ------------------------------------------------------------------

const playerReducer: Reducer<PlayerState, AppAction> = (
	state: PlayerState = INITIAL_STATE,
	action: AppAction
): PlayerState => {
	switch (action.type) {
	case 'PLAYER_SET_SAMPLE_READY':
		return setSampleReady(state, action.data as SetSampleReadyData)
	case 'PLAYER_SET_SAMPLE_STATUS':
		return setSampleStatus(state, action.data as SetSampleStatusData)
	case 'PLAYER_SET_SAMPLES':
		return setSamples(state, action.data as SetSamplesData)
	case 'PLAYER_SET_STATUS':
		return setStatus(state, action.data as SetStatusData)
	default:
		return state
	}
}

export default playerReducer
