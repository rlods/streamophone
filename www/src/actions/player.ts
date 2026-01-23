import type { AppThunk, AppDispatch, RootState, AppExtra } from '../types'
import type { PlayerTrack } from '../audio/AudioPlayer'
import { displayError } from './messages'

// ------------------------------------------------------------------

export const changePlayerSamples = (tracks: PlayerTrack[] | null): AppThunk => (dispatch: AppDispatch) => {
	dispatch({
		type: 'PLAYER_SET_SAMPLES',
		data: { tracks }
	})
}

export const changePlayerStatus = (playing: boolean): AppThunk => (dispatch: AppDispatch) => {
	dispatch({
		type: 'PLAYER_SET_STATUS',
		data: { playing }
	})
}

// ------------------------------------------------------------------

export const changePlayerSampleReady = (sampleIndex: number): AppThunk => (dispatch: AppDispatch) => {
	dispatch({
		type: 'PLAYER_SET_SAMPLE_READY',
		data: { sampleIndex }
	})
}

export const changePlayerSampleStatus = (sampleIndex: number, playing: boolean): AppThunk => (dispatch: AppDispatch) => {
	dispatch({
		type: 'PLAYER_SET_SAMPLE_STATUS',
		data: { playing, sampleIndex }
	})
}

// ------------------------------------------------------------------

export const loadPlayer = (data: string): AppThunk<Promise<void>> => async (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	try {
		app.audioPlayer.init(data)
	}
	catch (error) {
		const err = error as { response?: { data?: { message?: string } } }
		const message = err.response?.data?.message ?? String(error)
		console.log('Cannot load player', message)
		dispatch(displayError(`Cannot load player: ${message}`))
	}
}

export const play = (): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	app.audioPlayer.play()
}

export const pause = (): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	app.audioPlayer.pause()
}

export const registerPlayerCanvas = (canvas: HTMLCanvasElement | null): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	app.audioPlayer.attachCanvas(canvas)
}
