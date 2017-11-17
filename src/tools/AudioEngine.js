import { changeSampleAudioReady, changeSampleStatus } from '../actions/sampling'
import CustomAudio, { AUDIO_EVENT_PLAY, AUDIO_EVENT_PAUSE } from '../tools/CustomAudio'

// ------------------------------------------------------------------

export default class AudioEngine
{
	constructor()
	{
		this.audios = null
		this.context = new (window.AudioContext || window.webkitAudioContext)()
		this.record = {
			tracks: {}, // sampleIndex will become a dictionary key in that case
			events: []
		}
	}

	loadAudios(dispatch, tracks) {
		this.audios = tracks.map((track, sampleIndex) => {
			const audio = new CustomAudio(this.context, track.preview, e => {
				switch (e[0])
				{
				case AUDIO_EVENT_PLAY:
					if (!this.record.tracks[sampleIndex]) {
						const { id, loopStart, loopEnd, preview, speed, title, volume1, volume2 } = track
						this.record.tracks[sampleIndex] = { id, loopStart, loopEnd, preview, speed, title, volume: volume1 * volume2 }
					}
					dispatch(changeSampleStatus(sampleIndex, true))
					break
				case AUDIO_EVENT_PAUSE:
					dispatch(changeSampleStatus(sampleIndex, false))
					break
				default:
					break
				}
				if (this.record.tracks[sampleIndex]) // only record event of tracks which have been played
					this.record.events.push([Math.floor(this.context.currentTime * 1000), sampleIndex, e])
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

	snapshot() {
		console.log('RECORD JS', this.record)
		console.log('RECORD 64', btoa(JSON.stringify(this.record)))
	}
}