import { createStrategy } from '../strategies'
import AudioRecorder, { SamplerTrack } from './AudioRecorder'
import CustomAudio, { AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE } from './CustomAudio'
import { AUDIO_CONTEXT } from './'
import { loadTracks, LoadedTrack } from './TrackLoader'
import type { AppDispatch } from '../types'
import type Strategy from '../strategies/Strategy'

// ------------------------------------------------------------------

export interface ExtendedSamplerTrack extends SamplerTrack {
	playing: boolean
	ready: boolean
	bpm?: number
}

// ------------------------------------------------------------------

export default class AudioSampler {
	private _audios: CustomAudio[] | null = null
	private _dispatch: AppDispatch | null = null
	private _recorder: AudioRecorder | null = null
	private _strategy: Strategy | null = null

	constructor() {
		this._audios = null
		this._dispatch = null
		this._recorder = null
		this._strategy = null
	}

	attachDispatcher(dispatch: AppDispatch): void {
		this._dispatch = dispatch
	}

	// --------------------------------------------------------------

	getAudio(sampleIndex: number): CustomAudio | null {
		return this._audios && sampleIndex >= 0 && sampleIndex < this._audios.length ? this._audios[sampleIndex] : null
	}

	getRecorder(): AudioRecorder | null {
		return this._recorder
	}

	handleKeyDown(keyCode: number): void {
		if (this._strategy)
			this._strategy.handleKeyDown(keyCode)
	}

	handleKeyUp(keyCode: number): void {
		if (this._strategy)
			this._strategy.handleKeyUp(keyCode)
	}

	handleMidiEvent(channel: number, key: number, velocity: number): void {
		if (this._strategy)
			this._strategy.handleMidiEvent(channel, key, velocity)
	}

	handleSocketEvent(message: unknown): void {
		if (this._strategy)
			this._strategy.handleSocketMessage(message)
	}

	// --------------------------------------------------------------

	async init(
		samplerStrategyId: string,
		samplerDefaultDuration: number,
		providerId: string,
		resourceType: string,
		resourceId: string,
		samplesTransformation: string
	): Promise<void> {
		if (null !== this._audios)
			throw new Error('Sampler is already initialized')

		// Create recorder and strategy
		this._recorder = new AudioRecorder()
		this._strategy = createStrategy(samplerStrategyId)
		this._strategy.attachDispatcher(this._dispatch!)
		const samplesCount = this._strategy.samplesCount

		// Create tracks
		const loadedTracks = await loadTracks({
			providerId,
			resourceType,
			resourceId,
			samplesCount,
			samplesTransformation
		})

		const tracks: ExtendedSamplerTrack[] = loadedTracks.map((track: LoadedTrack) => {
			const extendedTrack = track as unknown as ExtendedSamplerTrack
			extendedTrack.loopStart = 0
			extendedTrack.loopEnd = samplerDefaultDuration > 0 ? extendedTrack.loopStart + (samplerDefaultDuration / 1000.0) : 0
			extendedTrack.playing = false
			extendedTrack.providerId = providerId
			extendedTrack.ready = false
			extendedTrack.speed = 1.0
			extendedTrack.volume1 = 0.5
			extendedTrack.volume2 = 1.0
			return extendedTrack
		})
		this._dispatch!({ type: 'SAMPLER_SET_SAMPLES', data: { tracks } })

		// Create audios
		this._audios = tracks.map((track, sampleIndex) => {
			const audio = new CustomAudio(track.preview, e => {
				if      (e[0] === AUDIO_EVENT_PLAY)  this._dispatch!({ type: 'SAMPLER_SET_SAMPLE_STATUS', data: { sampleIndex, playing: true } })
				else if (e[0] === AUDIO_EVENT_PAUSE) this._dispatch!({ type: 'SAMPLER_SET_SAMPLE_STATUS', data: { sampleIndex, playing: false } })
				this._recorder!.pushEvent(AUDIO_CONTEXT.currentTime, sampleIndex, e, track)
			})
			audio.setLoop(track.loopStart, track.loopEnd)
			audio.setVolume(track.volume1 * track.volume2)
			return audio
		})
		this._audios.forEach(async (audio, sampleIndex) => {
			try {
				await audio.init()
				this._dispatch!({ type: 'SAMPLER_SET_SAMPLE_READY', data: { sampleIndex } })
			}
			catch (error) {
				console.log('Audio buffer initialization failed:', (error as Error).message)
			}
		})
	}

	dispose(): void {
		if (this._audios) {
			this._audios.forEach(audio => audio.pause())
			this._audios = null
		}
		this._recorder = null
		this._strategy = null
	}
}
