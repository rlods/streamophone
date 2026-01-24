import { create } from 'zustand'
import type AudioPlayer from '../audio/AudioPlayer'
import type { PlayerTrack, PlayerCallbacks } from '../audio/AudioPlayer'
import { displayError } from './messagesStore'

// ------------------------------------------------------------------

interface PlayerState {
	playing: boolean
	tracks: PlayerTrack[] | null
	setSampleReady: (sampleIndex: number) => void
	setSampleStatus: (sampleIndex: number, playing: boolean) => void
	setSamples: (tracks: PlayerTrack[] | null) => void
	setStatus: (playing: boolean) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
	playing: false,
	tracks: null,

	setSampleReady: (sampleIndex: number) =>
		set((state) => ({
			tracks: state.tracks?.map((other, otherIndex) =>
				otherIndex !== sampleIndex ? other : { ...other, ready: true }
			) ?? null
		})),

	setSampleStatus: (sampleIndex: number, playing: boolean) =>
		set((state) => ({
			tracks: state.tracks?.map((other, otherIndex) =>
				otherIndex !== sampleIndex ? other : { ...other, playing }
			) ?? null
		})),

	setSamples: (tracks: PlayerTrack[] | null) =>
		set({ tracks }),

	setStatus: (playing: boolean) =>
		set({ playing })
}))

// ------------------------------------------------------------------
// Actions that interact with audioPlayer

let audioPlayerRef: AudioPlayer | null = null

export const setAudioPlayer = (player: AudioPlayer): void => {
	audioPlayerRef = player
	// Connect callbacks to store
	player.setCallbacks(createPlayerCallbacks())
}

export const createPlayerCallbacks = (): PlayerCallbacks => ({
	onStatusChange: (playing) => usePlayerStore.getState().setStatus(playing),
	onSamplesChange: (tracks) => usePlayerStore.getState().setSamples(tracks),
	onSampleReady: (sampleIndex) => usePlayerStore.getState().setSampleReady(sampleIndex),
	onSampleStatusChange: (sampleIndex, playing) => usePlayerStore.getState().setSampleStatus(sampleIndex, playing)
})

export const loadPlayer = async (data: string): Promise<void> => {
	if (!audioPlayerRef) return
	try {
		audioPlayerRef.initFromData(data)
	} catch (error) {
		const err = error as { response?: { data?: { message?: string } } }
		const message = err.response?.data?.message ?? String(error)
		console.log('Cannot load player', message)
		displayError(`Cannot load player: ${message}`)
	}
}

export const play = (): void => {
	audioPlayerRef?.play()
}

export const pause = (): void => {
	audioPlayerRef?.pause()
}

export const registerPlayerCanvas = (canvas: HTMLCanvasElement | null): void => {
	audioPlayerRef?.attachCanvas(canvas)
}
