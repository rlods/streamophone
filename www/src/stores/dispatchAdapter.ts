import { usePlayerStore } from './playerStore'
import { useSamplerStore, startSample, stopSample, handleMidiEvent, handleSocketEvent } from './samplerStore'
import type { PlayerTrack } from '../audio/AudioPlayer'
import type { ExtendedSamplerTrack } from '../audio/AudioSampler'

// Type for the action dispatched by legacy code
interface LegacyAction {
	type: string
	data?: Record<string, unknown>
}

// Create a dispatch-like function that routes Redux actions to Zustand stores
export const createDispatchAdapter = () => {
	return (action: LegacyAction | ((dispatch: (action: LegacyAction) => void) => void)): void => {
		// Handle thunk actions
		if (typeof action === 'function') {
			action(createDispatchAdapter())
			return
		}

		const { type, data = {} } = action

		// Route to player store
		if (type.startsWith('PLAYER_')) {
			const store = usePlayerStore.getState()
			switch (type) {
				case 'PLAYER_SET_SAMPLES':
					store.setSamples(data.tracks as PlayerTrack[] | null)
					break
				case 'PLAYER_SET_STATUS':
					store.setStatus(data.playing as boolean)
					break
				case 'PLAYER_SET_SAMPLE_READY':
					store.setSampleReady(data.sampleIndex as number)
					break
				case 'PLAYER_SET_SAMPLE_STATUS':
					store.setSampleStatus(data.sampleIndex as number, data.playing as boolean)
					break
			}
			return
		}

		// Route to sampler store
		if (type.startsWith('SAMPLER_')) {
			const store = useSamplerStore.getState()
			switch (type) {
				case 'SAMPLER_SET_SAMPLES':
					store.setSamples(data.tracks as ExtendedSamplerTrack[] | null)
					break
				case 'SAMPLER_SET_STATUS':
					store.setStatus(data.started as boolean)
					break
				case 'SAMPLER_SET_SAMPLE_READY':
					store.setSampleReady(data.sampleIndex as number)
					break
				case 'SAMPLER_SET_SAMPLE_STATUS':
					store.setSampleStatus(data.sampleIndex as number, data.playing as boolean)
					break
				case 'SAMPLER_SET_SAMPLE_BPM':
					store.setSampleBPM(data.sampleIndex as number, data.bpm as number)
					break
				case 'SAMPLER_SET_SAMPLE_NORMALIZATION_VOLUME':
					store.setSampleNormalizationVolume(data.sampleIndex as number, data.volume as number)
					break
				case 'SAMPLER_SET_SAMPLE_SPEED':
					store.setSampleSpeed(data.sampleIndex as number, data.speed as number)
					break
				case 'SAMPLER_SET_SAMPLE_VOLUME':
					store.setSampleVolume(data.sampleIndex as number, data.volume as number)
					break
				case 'SAMPLER_SET_DEFAULT_DURATION':
					store.setDefaultDuration(data.defaultDuration as number)
					break
				case 'SAMPLER_SET_STRATEGY':
					store.setStrategy(data.strategyId as string)
					break
				case 'SAMPLER_START_SAMPLE':
					startSample(data.sampleIndex as number)
					break
				case 'SAMPLER_STOP_SAMPLE':
					stopSample(data.sampleIndex as number)
					break
				case 'SAMPLER_HANDLE_MIDI_EVENT':
					handleMidiEvent(data.channel as number, data.key as number, data.velocity as number)
					break
				case 'SAMPLER_HANDLE_SOCKET_EVENT':
					handleSocketEvent(data.message)
					break
			}
			return
		}

		console.warn('Unknown action type:', type)
	}
}
