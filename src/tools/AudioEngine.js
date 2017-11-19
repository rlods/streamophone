import { changeSampleAudioReady, changeSampleStatus } from '../actions/sampler'
import AudioRecorder from './AudioRecorder'
import CustomAudio, { AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE } from './CustomAudio'
import { AUDIO_CONTEXT} from './'

// ------------------------------------------------------------------

export default class AudioEngine
{
	constructor() {
		this._audios = null
		this.recorder = new AudioRecorder()
	}

	loadAudios(dispatch, tracks) {
		this._audios = tracks.map((track, sampleIndex) => {
			const audio = new CustomAudio(track.preview, e => {
				if      (e[0] === AUDIO_EVENT_PLAY)  dispatch(changeSampleStatus(sampleIndex, true))
				else if (e[0] === AUDIO_EVENT_PAUSE) dispatch(changeSampleStatus(sampleIndex, false))
				this.recorder.pushEvent(AUDIO_CONTEXT.currentTime, sampleIndex, e, track)
			})
			audio.setLoop(track.loopStart, track.loopEnd)
			audio.setVolume(track.volume1 * track.volume2)
			audio.init().then(() => dispatch(changeSampleAudioReady(sampleIndex)))
			return audio
		})
	}

	getAudio(sampleIndex) {
		return this._audios && sampleIndex >= 0 && sampleIndex < this._audios.length ? this._audios[sampleIndex] : null
	}

	stopAll() {
		if (this._audios) {
			// Stop all previously loaded audios
			this._audios.forEach(audio => audio.stop())
			this._audios = null
		}
	}
}