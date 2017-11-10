export const changeSampleCount = count => dispatch => dispatch({
	type: 'SAMPLING_SET_COUNT',
	data: {
		count
	}
})

export const changeSampleDuration = duration => dispatch => dispatch({
	type: 'SAMPLING_SET_DURATION',
	data: {
		duration
	}
})

export const playSample = sampleIndex => (dispatch, getState) => {
	const state = getState()
	const sampleCount = state.sampling.count
	const sampleDuration = state.sampling.duration
	const tracks = state.playlist.tracks
	if (sampleIndex >= 0 && sampleIndex < sampleCount) {
		const track = tracks[sampleIndex % tracks.length]
		track.currentTime = 10
		track.play()
		setTimeout(() => {
			track.pause()
		}, sampleDuration)
	}
}
