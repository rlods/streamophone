import { changeSamplerSampleReady, changeSamplerSampleStatus, changeSamplerSamples } from '../actions/sampler'
import AudioRecorder from './AudioRecorder'
import CustomAudio, { AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE } from './CustomAudio'
import { AUDIO_CONTEXT} from './'

// ------------------------------------------------------------------

export default class AudioSampler
{
	constructor() {
		this._audios = null
		this._dispatch = null
		this._recorder = null
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
	
	// --------------------------------------------------------------

	init(tracks) {
		if (null !== this._audios)
			throw new Error('Sampler is already initialized')
		if (null === tracks || !(tracks instanceof Array))
			throw new Error('Invalid sampler samples')

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
	}
}