import { create } from 'zustand'
import config from '../config'
import { getSearchParam } from '../tools'

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

// ------------------------------------------------------------------

interface SourceState {
	bpm: number
	id: string
	transformation: string
	type: string
	setBpm: (bpm: number) => void
	setId: (id: string) => void
	setTransformation: (transformation: string) => void
	setType: (type: string) => void
}

export const useSourceStore = create<SourceState>((set) => ({
	bpm: getInitialBpm(),
	id: getInitialId(),
	transformation: getInitialTransformation(),
	type: getInitialType(),

	setBpm: (bpm: number) => {
		sessionStorage.setItem('DEFAULT_SOURCE_BPM', String(bpm))
		set({ bpm })
	},

	setId: (id: string) => {
		sessionStorage.setItem('DEFAULT_SOURCE_ID', id)
		set({ id })
	},

	setTransformation: (transformation: string) => {
		sessionStorage.setItem('DEFAULT_SOURCE_TRANSFORMATION', transformation)
		set({ transformation })
	},

	setType: (type: string) => {
		sessionStorage.setItem('DEFAULT_SOURCE_TYPE', type)
		set({ type })
	}
}))
