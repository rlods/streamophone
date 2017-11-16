import config from '../config'
import { getSearchParam } from '../tools'

// ------------------------------------------------------------------

const INITIAL_STATE = {
	audios: null,
	tracks: null,
	sampleDuration: getSearchParam('sampling_duration') || sessionStorage.getItem('DEFAULT_SAMPLING_DURATION') || config.DEFAULT.SAMPLING_DURATION,
	strategyId: getSearchParam('sampling_strategy') || sessionStorage.getItem('DEFAULT_SAMPLING_STRATEGY') || config.DEFAULT.SAMPLING_STRATEGY
}

// ------------------------------------------------------------------

const setSampleBPM = (state, { sampleIndex, bpm }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, bpm }) })

const setSampleNormalizationVolume = (state, { sampleIndex, volume }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, volume1: volume, normalized: true }) })

const setSampleReady = (state, { sampleIndex }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, ready: true }) })

const setSampleSpeed = (state, { sampleIndex, speed }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, speed }) })

const setSampleStatus = (state, { playing, sampleIndex }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, playing }) })

const setSampleVolume = (state, { sampleIndex, volume }) => // TODO
	({ ...state, tracks: state.tracks.map((other, otherIndex) => otherIndex !== sampleIndex ? other : { ...other, volume2: volume }) })

const setSampleDuration = (state, { sampleDuration }) =>
	({ ...state, sampleDuration })

const setTracks = (state, { audios, tracks }) =>
	({ ...state, audios, tracks })

const setStrategy = (state, { strategyId }) =>
	({ ...state, strategyId })

// ------------------------------------------------------------------

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	case 'SAMPLING_SET_SAMPLE_DURATION':
		return setSampleDuration(state, action.data)
	case 'SAMPLING_SET_SAMPLE_READY':
		return setSampleReady(state, action.data)
	case 'SAMPLING_SET_SAMPLE_SPEED':
		return setSampleSpeed(state, action.data)
	case 'SAMPLING_SET_SAMPLE_BPM':
		return setSampleBPM(state, action.data)
	case 'SAMPLING_SET_SAMPLE_NORMALIZATION_VOLUME':
		return setSampleNormalizationVolume(state, action.data)
	case 'SAMPLING_SET_SAMPLE_STATUS':
		return setSampleStatus(state, action.data)
	case 'SAMPLING_SET_SAMPLE_VOLUME':
		return setSampleVolume(state, action.data)
	case 'SAMPLING_SET_STRATEGY':
		return setStrategy(state, action.data)
	case 'SAMPLING_SET_TRACKS':
		return setTracks(state, action.data)
	default:
		return state
	}
}