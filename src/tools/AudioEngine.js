import { changeSampleAudioReady, changeSampleStatus } from '../actions/sampler'
import AudioRecorder from './AudioRecorder'
import CustomAudio, { AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE } from './CustomAudio'

// ------------------------------------------------------------------

export default class AudioEngine
{
	constructor()
	{
		this.audios = null
		this.context = new (window.AudioContext || window.webkitAudioContext)()
		this.recorder = new AudioRecorder()
	}

	loadAudios(dispatch, tracks) {
		this.audios = tracks.map((track, sampleIndex) => {
			const audio = new CustomAudio(this.context, track.preview, e => {
				if      (e[0] === AUDIO_EVENT_PLAY)  dispatch(changeSampleStatus(sampleIndex, true))
				else if (e[0] === AUDIO_EVENT_PAUSE) dispatch(changeSampleStatus(sampleIndex, false))
				this.recorder.pushEvent(this.context.currentTime, sampleIndex, e, track)
			})
			audio.setLoop(track.loopStart, track.loopEnd)
			audio.setVolume(track.volume1 * track.volume2)
			audio.init().then(() => dispatch(changeSampleAudioReady(sampleIndex)))
			return audio
		})
	}

	getAudio(sampleIndex) {
		return this.audios && sampleIndex >= 0 && sampleIndex < this.audios.length ? this.audios[sampleIndex] : null
	}

	stopAll() {
		if (this.audios) {
			// Stop all previously loaded audios
			this.audios.forEach(audio => audio.stop())
			this.audios = null
		}
	}
}