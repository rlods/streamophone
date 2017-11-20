import { changeSampleAudioReady, changeSampleStatus } from '../actions/sampler'
import AudioRecorder from './AudioRecorder'
import CustomAudio, { AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE } from './CustomAudio'
import { AUDIO_CONTEXT} from './'

// ------------------------------------------------------------------

export default class AudioEngine
{
	constructor() {
		this._audios = null
		this._dispatch = null
		this._recorder = null
	}

	attach(dispatch) {
		this._dispatch = dispatch
	}

	getAudio(sampleIndex) {
		return this._audios && sampleIndex >= 0 && sampleIndex < this._audios.length ? this._audios[sampleIndex] : null
	}

	getRecorder() {
		return this._recorder
	}

	start(tracks, provider) {
		if (null !== this._audios)
			throw new Error('Engine is already started')

		this._recorder = new AudioRecorder(provider)
		this._audios = tracks.map((track, sampleIndex) => {
			const audio = new CustomAudio(track.preview, e => {
				if      (e[0] === AUDIO_EVENT_PLAY)  this._dispatch(changeSampleStatus(sampleIndex, true))
				else if (e[0] === AUDIO_EVENT_PAUSE) this._dispatch(changeSampleStatus(sampleIndex, false))
				this._recorder.pushEvent(AUDIO_CONTEXT.currentTime, sampleIndex, e, track)
			})
			audio.setLoop(track.loopStart, track.loopEnd)
			audio.setVolume(track.volume1 * track.volume2)
			audio.init().then(() => this._dispatch(changeSampleAudioReady(sampleIndex)))
			return audio
		})
	}

	stop() {
		if (this._audios) {
			this._audios.forEach(audio => audio.stop())
			this._audios = null
		}
		this._recorder = null
	}
}