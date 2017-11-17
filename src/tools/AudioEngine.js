import { changeSampleAudioReady, changeSampleStatus } from '../actions/sampling'
import CustomAudio from '../tools/CustomAudio'

// ------------------------------------------------------------------

export default class AudioEngine
{
	constructor()
	{
		this.audios = null
	}

	loadAudios(dispatch, sampling, tracks) {
		this.audios = tracks.map((track, sampleIndex) => {
			const audio = new CustomAudio(track.preview, () => dispatch(changeSampleStatus(sampleIndex, true)), () => dispatch(changeSampleStatus(sampleIndex, false)))
			audio.setLoop(sampling.duration)
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