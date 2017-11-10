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
		const tracks = state.playlist.tracks
		const track = tracks[sampleIndex % tracks.length]
		if (track.paused) {
			track.currentTime = 0
			track.play()
		}
	}
}

export const stopSample = sampleIndex => (dispatch, getState) => {
	const state = getState()
	const { count } = state.sampling
	if (sampleIndex >= 0 && sampleIndex < count) {
		const tracks = state.playlist.tracks
		const track = tracks[sampleIndex % tracks.length]
		if (!track.paused)
			track.pause()
	}
}
