export const changeSampleCount = count => dispatch => dispatch({
	type: 'SAMPLING_SET_COUNT',
	data: {
		count
	}
})

export const startSample = sampleIndex => (dispatch, getState) => {
	const state = getState()
	const { audios, tracks } = state.sampling
	const indexMod = Math.abs(sampleIndex) % audios.length
	const audio = audios[indexMod]
	const track = tracks[indexMod]
	if (audio.paused) {
		audio.addEventListener('pause', () => {
			dispatch({
				type: 'SAMPLING_SET_TRACK_STATUS',
				data: {
					playing: false,
					trackId: track.id
				}
			})
		})
		audio.currentTime = 0
		audio.play()
		dispatch({
			type: 'SAMPLING_SET_TRACK_STATUS',
			data: {
				playing: true,
				trackId: track.id
			}
		})
	}
}

export const stopSample = sampleIndex => (dispatch, getState) => {
	const state = getState()
	const audios = state.sampling.audios
	const audio = audios[Math.abs(sampleIndex) % audios.length]
	if (!audio.paused)
		audio.pause()
}

export const setSampleVolume = (sampleIndex, volume) => (dispatch, getState) => {
	const state = getState()
	const { audios, tracks } = state.sampling
	const indexMod = Math.abs(sampleIndex) % audios.length
	const audio = audios[indexMod]
	const track = tracks[indexMod]
	track.volume2 = volume < 0 ? 0 : volume > 1 ? 1 : volume
	audio.volume = track.volume1 * track.volume2
}
