export const changeSampleCount = count => dispatch => dispatch({
	type: 'SAMPLING_SET_COUNT',
	data: {
		count
	}
})

export const startSample = sampleIndex => (dispatch, getState) => {
	const state = getState()
	const { count } = state.sampling
	if (sampleIndex >= 0 && sampleIndex < count) {
		const audios = state.playlist.audios
		const audio = audios[sampleIndex % audios.length]
		if (audio.paused) {
			audio.currentTime = 0
			audio.play()
		}
	}
}

export const stopSample = sampleIndex => (dispatch, getState) => {
	const state = getState()
	const { count } = state.sampling
	if (sampleIndex >= 0 && sampleIndex < count) {
		const audios = state.playlist.audios
		const audio = audios[sampleIndex % audios.length]
		if (!audio.paused)
			audio.pause()
	}
}
