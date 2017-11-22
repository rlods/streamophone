import { changeSamplerSampleReady, changeSamplerSampleStatus, changeSamplerSamples } from '../actions/sampler'
import { createStrategy } from '../strategies'
import AudioRecorder from './AudioRecorder'
import CustomAudio, { AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE } from './CustomAudio'
import { AUDIO_CONTEXT} from './'
import { loadTracks } from './TrackLoader'

// ------------------------------------------------------------------

export default class AudioSampler
{
	constructor() {
		this._audios = null
		this._dispatch = null
		this._recorder = null
		this._strategy = null
	}

	attachDispatcher(dispatch) {
		this._dispatch = dispatch
	}

	// --------------------------------------------------------------

	getAudio(sampleIndex) {
		return this._audios && sampleIndex >= 0 && sampleIndex < this._audios.length ? this._audios[sampleIndex] : null
	}

	getRecorder() {
		return this._recorder
	}
		
	handleKeyDown(keyCode) {
		if (this._strategy)
			this._strategy.handleKeyDown(keyCode)
	}

	handleKeyUp(keyCode) {
		if (this._strategy)
			this._strategy.handleKeyUp(keyCode)
	}

	handleMidiEvent(channel, key, velocity) {
		if (this._strategy)
			this._strategy.handleMidiEvent(channel, key, velocity)
	}

	handleSocketEvent(message) {
		if (this._strategy)
			this._strategy.handleSocketMessage(message)
	}

	// --------------------------------------------------------------

	async init(samplerStrategyId, samplerDefaultDuration, providerId, resourceType, resourceId, sourceBPM, sourceTransformation) {
		if (null !== this._audios)
			throw new Error('Sampler is already initialized')

		// Create strategy
		this._strategy = createStrategy(samplerStrategyId)
		this._strategy.attachDispatcher(this._dispatch)

		// Get tracks
		const tracks = (await loadTracks(this._dispatch, providerId, resourceType, resourceId, this._strategy.samplesCount, sourceBPM, sourceTransformation)).map(track => {
			track.loopStart = 0
			track.loopEnd = samplerDefaultDuration > 0 ? track.loopStart + (samplerDefaultDuration / 1000.0) : 0
			track.playing = false
			track.providerId = providerId
			track.ready = false
			track.speed = 1.0
			track.volume1 = 0.5
			track.volume2 = 1.0
			return track
		})

		// Create audios
		this._recorder = new AudioRecorder()
		this._audios = tracks.map((track, sampleIndex) => {
			const audio = new CustomAudio(track.preview, e => {
				if      (e[0] === AUDIO_EVENT_PLAY)  this._dispatch(changeSamplerSampleStatus(sampleIndex, true))
				else if (e[0] === AUDIO_EVENT_PAUSE) this._dispatch(changeSamplerSampleStatus(sampleIndex, false))
				this._recorder.pushEvent(AUDIO_CONTEXT.currentTime, sampleIndex, e, track)
			})
			audio.setLoop(track.loopStart, track.loopEnd)
			audio.setVolume(track.volume1 * track.volume2)
			audio.init().then(() => this._dispatch(changeSamplerSampleReady(sampleIndex)))
			return audio
		})
		this._dispatch(changeSamplerSamples(tracks))
		
	}

	dispose() {
		if (this._audios) {
			this._audios.forEach(audio => audio.stop())
			this._audios = null
		}
		this._recorder = null
		this._strategy = null
	}
}