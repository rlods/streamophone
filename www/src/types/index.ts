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
