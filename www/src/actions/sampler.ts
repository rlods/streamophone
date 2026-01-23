import type { NavigateFunction } from 'react-router-dom'
import type { AppThunk, AppDispatch, RootState, AppExtra } from '../types'
import type { ExtendedSamplerTrack } from '../audio/AudioSampler'
import { displayError, displayMessage } from './messages'

// ------------------------------------------------------------------

const KEY_SPACE = 32

// ------------------------------------------------------------------

export const changeSamplerDefaultDuration = (defaultDuration: number): AppThunk => (dispatch: AppDispatch) => {
	sessionStorage.setItem('DEFAULT_SAMPLER_DURATION', String(defaultDuration))
	dispatch({
		type: 'SAMPLER_SET_DEFAULT_DURATION',
		data: { defaultDuration }
	})
}

export const changeSamplerStrategy = (strategyId: string): AppThunk => (dispatch: AppDispatch) => {
	sessionStorage.setItem('DEFAULT_SAMPLER_STRATEGY', strategyId)
	dispatch({
		type: 'SAMPLER_SET_STRATEGY',
		data: { strategyId }
	})
}

export const changeSamplerSamples = (tracks: ExtendedSamplerTrack[] | null): AppThunk => (dispatch: AppDispatch) => {
	dispatch({
		type: 'SAMPLER_SET_SAMPLES',
		data: { tracks }
	})
}

export const changeSamplerStatus = (started: boolean): AppThunk => (dispatch: AppDispatch) => {
	dispatch({
		type: 'SAMPLER_SET_STATUS',
		data: { started }
	})
}

// ------------------------------------------------------------------

export const changeSamplerSampleReady = (sampleIndex: number): AppThunk => (dispatch: AppDispatch) => {
	dispatch({
		type: 'SAMPLER_SET_SAMPLE_READY',
		data: { sampleIndex }
	})
}

export const changeSamplerSampleBPM = (sampleIndex: number, bpm: number): AppThunk => (dispatch: AppDispatch) => {
	dispatch({
		type: 'SAMPLER_SET_SAMPLE_BPM',
		data: { sampleIndex, bpm }
	})
}

export const changeSamplerSampleNormalizationVolume = (sampleIndex: number, volume: number): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio) {
		const track = getState().sampler.tracks?.[sampleIndex]
		if (track) {
			audio.setVolume(volume * (track.volume2 ?? 1))
		}
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_NORMALIZATION_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSamplerSampleSpeed = (sampleIndex: number, speed: number): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio) {
		audio.setSpeed(speed)
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_SPEED',
			data: { sampleIndex, speed }
		})
	}
}

export const changeSamplerSampleVolume = (sampleIndex: number, volume: number): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio) {
		const track = getState().sampler.tracks?.[sampleIndex]
		if (track) {
			audio.setVolume((track.volume1 ?? 1) * volume)
		}
		dispatch({
			type: 'SAMPLER_SET_SAMPLE_VOLUME',
			data: { sampleIndex, volume }
		})
	}
}

export const changeSamplerSampleStatus = (sampleIndex: number, playing: boolean): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState
) => {
	if (!getState().sampler.started) {
		dispatch(displayMessage('info', 'Press SPACE to listen and share!'))
		dispatch(changeSamplerStatus(true))
	}
	dispatch({
		type: 'SAMPLER_SET_SAMPLE_STATUS',
		data: { playing, sampleIndex }
	})
}

// --------------------------------------------------------------

export const handleKeyDown = (keyCode: number): AppThunk<Promise<void>> => async (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	if (keyCode === KEY_SPACE)
		app.audioSampler.getRecorder().snapshot()
	else
		app.audioSampler.handleKeyDown(keyCode)
}

export const handleKeyUp = (keyCode: number): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	app.audioSampler.handleKeyUp(keyCode)
}

export const handleMidiEvent = (channel: number, key: number, velocity: number): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	app.audioSampler.handleMidiEvent(channel, key, velocity)
}

export const handleSocketEvent = (message: unknown): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	app.audioSampler.handleSocketMessage(message)
}

// --------------------------------------------------------------

export const registerSampleCanvas = (sampleIndex: number, canvas: HTMLCanvasElement | null): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio)
		audio.attachCanvas(canvas)
}

export const startSample = (sampleIndex: number): AppThunk<Promise<void>> => async (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio)
		audio.play()
}

export const stopSample = (sampleIndex: number): AppThunk<Promise<void>> => async (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	const audio = app.audioSampler.getAudio(sampleIndex)
	if (audio)
		audio.pause()
}

export const goToSampler = (navigate: NavigateFunction): AppThunk<Promise<void>> => async (
	dispatch: AppDispatch,
	getState: () => RootState
) => {
	const { sampler, source } = getState()
	navigate(`/make?sampler_duration=${sampler.defaultDuration}&sampler_strategy=${sampler.strategyId}&source_bpm=${source.bpm}&source_id=${encodeURI(source.id)}&source_transformation=${source.transformation}&source_type=${source.type}`)
	dispatch(changeSamplerSamples(null)) // TODO: we should stop loading tracks (for ex soundcloud tracks are slow to download)
}

// --------------------------------------------------------------

export const loadSampler = (): AppThunk<Promise<void>> => async (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	const { sampler, source } = getState()
	try {
		const [ resourceProviderId, resourceType ] = source.type.split('_')
		app.audioSampler.dispose()
		await app.audioSampler.init(
			sampler.strategyId,
			sampler.defaultDuration,
			resourceProviderId,
			resourceType,
			source.id,
			// source.bpm,
			source.transformation)
	}
	catch (error) {
		const err = error as { response?: { data?: { message?: string } } }
		const message = err.response?.data?.message ?? String(error)
		console.log('Cannot load sampler', message)
		dispatch(displayError(`Cannot load sampler: ${message}`))
	}
}
