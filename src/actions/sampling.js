
export const changeSamplerType = samplerType => dispatch => dispatch({
	type: 'SAMPLING_SET_SAMPLER_TYPE',
	data: {
		samplerType
	}
})

export const startSample = sampleIndex => async (dispatch, getState) => {
	const state = getState()
	const { audios, tracks } = state.sampling
	const indexMod = Math.abs(sampleIndex) % audios.length
	const audio = audios[indexMod]
	const track = tracks[indexMod]
	if (!track.playing) {
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
		await audio.play()
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
	const { audios, tracks } = state.sampling
	const indexMod = Math.abs(sampleIndex) % audios.length
	const audio = audios[indexMod]
	const track = tracks[indexMod]
	if (track.playing) {
		audio.pause()
		// TODO: do we really need the following dispatch which is already handle by the addEventListener('pause')
		dispatch({
			type: 'SAMPLING_SET_TRACK_STATUS',
			data: {
				playing: false,
				trackId: track.id
			}
		})
	}
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
