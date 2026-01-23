import { create } from 'zustand'
import type { NavigateFunction } from 'react-router-dom'
import config from '../config'
import { getSearchParam } from '../tools'
import type { Track } from '../types'
import type { ExtendedSamplerTrack } from '../audio/AudioSampler'
import type AudioSampler from '../audio/AudioSampler'
import { displayError, displayMessage } from './messagesStore'
import { useSourceStore } from './sourceStore'

// ------------------------------------------------------------------

const KEY_SPACE = 32

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

// ------------------------------------------------------------------

interface SamplerState {
	started: boolean
	tracks: Track[] | null
	defaultDuration: number
	strategyId: string
	setDefaultDuration: (defaultDuration: number) => void
	setStrategy: (strategyId: string) => void
	setSamples: (tracks: ExtendedSamplerTrack[] | null) => void
	setStatus: (started: boolean) => void
	setSampleReady: (sampleIndex: number) => void
	setSampleBPM: (sampleIndex: number, bpm: number) => void
	setSampleNormalizationVolume: (sampleIndex: number, volume: number) => void
	setSampleSpeed: (sampleIndex: number, speed: number) => void
	setSampleVolume: (sampleIndex: number, volume: number) => void
	setSampleStatus: (sampleIndex: number, playing: boolean) => void
}

export const useSamplerStore = create<SamplerState>((set, get) => ({
	started: false,
	tracks: null,
	defaultDuration: getInitialDuration(),
	strategyId: getInitialStrategy(),

	setDefaultDuration: (defaultDuration: number) => {
		sessionStorage.setItem('DEFAULT_SAMPLER_DURATION', String(defaultDuration))
		set({ defaultDuration })
	},

	setStrategy: (strategyId: string) => {
		sessionStorage.setItem('DEFAULT_SAMPLER_STRATEGY', strategyId)
		set({ strategyId })
	},

	setSamples: (tracks: ExtendedSamplerTrack[] | null) =>
		set({ tracks }),

	setStatus: (started: boolean) =>
		set({ started }),

	setSampleReady: (sampleIndex: number) =>
		set((state) => ({
			tracks: state.tracks?.map((other, otherIndex) =>
				otherIndex !== sampleIndex ? other : { ...other, ready: true }
			) ?? null
		})),

	setSampleBPM: (sampleIndex: number, bpm: number) =>
		set((state) => ({
			tracks: state.tracks?.map((other, otherIndex) =>
				otherIndex !== sampleIndex ? other : { ...other, bpm }
			) ?? null
		})),

	setSampleNormalizationVolume: (sampleIndex: number, volume: number) =>
		set((state) => ({
			tracks: state.tracks?.map((other, otherIndex) =>
				otherIndex !== sampleIndex ? other : { ...other, volume1: volume, normalized: true }
			) ?? null
		})),

	setSampleSpeed: (sampleIndex: number, speed: number) =>
		set((state) => ({
			tracks: state.tracks?.map((other, otherIndex) =>
				otherIndex !== sampleIndex ? other : { ...other, speed }
			) ?? null
		})),

	setSampleVolume: (sampleIndex: number, volume: number) =>
		set((state) => ({
			tracks: state.tracks?.map((other, otherIndex) =>
				otherIndex !== sampleIndex ? other : { ...other, volume2: volume }
			) ?? null
		})),

	setSampleStatus: (sampleIndex: number, playing: boolean) => {
		const state = get()
		if (!state.started) {
			displayMessage('info', 'Press SPACE to listen and share!')
			set({ started: true })
		}
		set((state) => ({
			tracks: state.tracks?.map((other, otherIndex) =>
				otherIndex !== sampleIndex ? other : { ...other, playing }
			) ?? null
		}))
	}
}))

// ------------------------------------------------------------------
// Actions that interact with audioSampler

let audioSamplerRef: AudioSampler | null = null

export const setAudioSampler = (sampler: AudioSampler): void => {
	audioSamplerRef = sampler
}

export const changeSamplerSampleNormalizationVolume = (sampleIndex: number, volume: number): void => {
	if (!audioSamplerRef) return
	const audio = audioSamplerRef.getAudio(sampleIndex)
	if (audio) {
		const track = useSamplerStore.getState().tracks?.[sampleIndex]
		if (track) {
			audio.setVolume(volume * (track.volume2 ?? 1))
		}
		useSamplerStore.getState().setSampleNormalizationVolume(sampleIndex, volume)
	}
}

export const changeSamplerSampleSpeed = (sampleIndex: number, speed: number): void => {
	if (!audioSamplerRef) return
	const audio = audioSamplerRef.getAudio(sampleIndex)
	if (audio) {
		audio.setSpeed(speed)
		useSamplerStore.getState().setSampleSpeed(sampleIndex, speed)
	}
}

export const changeSamplerSampleVolume = (sampleIndex: number, volume: number): void => {
	if (!audioSamplerRef) return
	const audio = audioSamplerRef.getAudio(sampleIndex)
	if (audio) {
		const track = useSamplerStore.getState().tracks?.[sampleIndex]
		if (track) {
			audio.setVolume((track.volume1 ?? 1) * volume)
		}
		useSamplerStore.getState().setSampleVolume(sampleIndex, volume)
	}
}

export const handleKeyDown = async (keyCode: number): Promise<void> => {
	if (!audioSamplerRef) return
	if (keyCode === KEY_SPACE)
		audioSamplerRef.getRecorder().snapshot()
	else
		audioSamplerRef.handleKeyDown(keyCode)
}

export const handleKeyUp = (keyCode: number): void => {
	audioSamplerRef?.handleKeyUp(keyCode)
}

export const handleMidiEvent = (channel: number, key: number, velocity: number): void => {
	audioSamplerRef?.handleMidiEvent(channel, key, velocity)
}

export const handleSocketEvent = (message: unknown): void => {
	audioSamplerRef?.handleSocketMessage(message)
}

export const registerSampleCanvas = (sampleIndex: number, canvas: HTMLCanvasElement | null): void => {
	if (!audioSamplerRef) return
	const audio = audioSamplerRef.getAudio(sampleIndex)
	if (audio)
		audio.attachCanvas(canvas)
}

export const startSample = async (sampleIndex: number): Promise<void> => {
	if (!audioSamplerRef) return
	const audio = audioSamplerRef.getAudio(sampleIndex)
	if (audio)
		audio.play()
}

export const stopSample = async (sampleIndex: number): Promise<void> => {
	if (!audioSamplerRef) return
	const audio = audioSamplerRef.getAudio(sampleIndex)
	if (audio)
		audio.pause()
}

export const goToSampler = (navigate: NavigateFunction): void => {
	const sampler = useSamplerStore.getState()
	const source = useSourceStore.getState()
	navigate(`/make?sampler_duration=${sampler.defaultDuration}&sampler_strategy=${sampler.strategyId}&source_bpm=${source.bpm}&source_id=${encodeURI(source.id)}&source_transformation=${source.transformation}&source_type=${source.type}`)
	useSamplerStore.getState().setSamples(null)
}

export const loadSampler = async (): Promise<void> => {
	if (!audioSamplerRef) return
	const sampler = useSamplerStore.getState()
	const source = useSourceStore.getState()
	try {
		const [resourceProviderId, resourceType] = source.type.split('_')
		audioSamplerRef.dispose()
		await audioSamplerRef.init(
			sampler.strategyId,
			sampler.defaultDuration,
			resourceProviderId,
			resourceType,
			source.id,
			source.transformation
		)
	} catch (error) {
		const err = error as { response?: { data?: { message?: string } } }
		const message = err.response?.data?.message ?? String(error)
		console.log('Cannot load sampler', message)
		displayError(`Cannot load sampler: ${message}`)
	}
}
