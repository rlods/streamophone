import type { ThunkAction, ThunkDispatch } from 'redux-thunk'
import type { Action } from 'redux'

// Track types
export interface Track {
	bpm: number
	cover?: string
	normalized?: boolean
	playing: boolean
	ready: boolean
	speed: number
	title: string
	totalDuration?: number
	url: string
	volume1?: number
	volume2?: number
}

// Message type
export interface Message {
	id: number
	type: 'info' | 'error' | 'warning'
	text: string
}

// State types
export interface AppState {
	[key: string]: unknown
}

export interface PlayerState {
	playing: boolean
	tracks: Track[] | null
}

export interface SamplerState {
	started: boolean
	tracks: Track[] | null
	defaultDuration: number
	strategyId: string
}

export interface SourceState {
	bpm: number
	id: string
	transformation: string
	type: string
}

export type MessagesState = Message[]

// Root state
export interface RootState {
	app: AppState
	player: PlayerState
	messages: MessagesState
	sampler: SamplerState
	source: SourceState
}

// Action types
export interface AppAction extends Action<string> {
	data?: Record<string, unknown>
}

// Thunk types
export interface AppExtra {
	app: {
		audioPlayer: AudioPlayerType
		audioSampler: AudioSamplerType
		drivers: Record<string, DriverType>
	}
}

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	AppExtra,
	AppAction
>

export type AppDispatch = ThunkDispatch<RootState, AppExtra, AppAction>

// Audio types (simplified interfaces for external classes)
export interface AudioPlayerType {
	attachDispatcher: (dispatch: AppDispatch) => void
	dispose: () => void
	init: (data: string) => Promise<void>
	play: () => void
	pause: () => void
	attachCanvas: (canvas: HTMLCanvasElement | null) => void
}

export interface AudioSamplerType {
	attachDispatcher: (dispatch: AppDispatch) => void
	dispose: () => void
	init: (
		strategyId: string,
		defaultDuration: number,
		resourceProviderId: string,
		resourceType: string,
		sourceId: string,
		transformation: string
	) => Promise<void>
	getAudio: (index: number) => CustomAudioType | null
	getRecorder: () => AudioRecorderType
	handleKeyDown: (keyCode: number) => void
	handleKeyUp: (keyCode: number) => void
	handleMidiEvent: (channel: number, key: number, velocity: number) => void
	handleSocketMessage: (message: unknown) => void
}

export interface CustomAudioType {
	play: () => void
	pause: () => void
	setVolume: (volume: number) => void
	setSpeed: (speed: number) => void
	attachCanvas: (canvas: HTMLCanvasElement | null) => void
}

export interface AudioRecorderType {
	snapshot: () => void
}

export interface DriverType {
	attachDispatcher: (dispatch: AppDispatch) => void
}

// Config types
export interface BpmOption {
	value: number
	label: string
}

export interface DurationOption {
	value: number
	label: string
}

export interface CuratedSource {
	sourceType: string
	sourceId: string
	title: string
}

export interface ControllerDef {
	driver: string
	label: string
}

export interface SourceTypeDef {
	label: string
	input_label: string
}

export interface Config {
	API: {
		URL: string | undefined
	}
	DEFAULT: {
		SAMPLER_DURATION: number
		SAMPLER_STRATEGY: string
		SOURCE_BPM: number
		SOURCE_ID: string
		SOURCE_TRANSFORMATION: string
		SOURCE_TYPE: string
	}
	ENABLE_LOGGER: boolean
	DRIVERS: Record<string, { type: string; socketUrl?: string; socketPrefix?: string }>
	SPLASH: {
		SHOW_BPM: boolean
		SHOW_CONTROLLER_SELECTION: boolean
		SHOW_CURATION: boolean
		SHOW_LENGTH_SELECTION: boolean
		SHOW_SOURCE_SELECTION: boolean
		SHOW_SOURCE_TRANSFORMATION: boolean
		BPMS: BpmOption[]
		CURATED_SOURCES: CuratedSource[]
		DURATIONS: DurationOption[]
		TRANSFORMATIONS: Record<string, string>
	}
	CONTROLLERS: Record<string, ControllerDef>
	SOURCE_TYPES: Record<string, SourceTypeDef>
}
