import AudioRecord from '../tools/AudioRecord'

// --------------------------------------------------------------

export const loadPlayer = data => dispatch => {
	dispatch({
		type: 'PLAYER_SET_RECORD',
		data: { record: new AudioRecord(data) }
	})
}

// --------------------------------------------------------------
