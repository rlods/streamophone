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
	if (audio.paused) {
		audio.currentTime = 0
		audio.play()
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
	track.volume2 = volume
	audio.volume = track.volume1 * track.volume2
}
