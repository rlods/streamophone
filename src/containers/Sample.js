import { connect } from 'react-redux'
//
import { startSample, stopSample } from '../actions/sampling'
import Sample from '../components/Sample'

// --------------------------------------------------------------

const SOUND_IMG = require('../assets/sound.png')

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => {
	const sample = state.sampling.tracks[ownProps.index]
	return {
		bpm: Math.floor(sample.bpm),
		cover: sample.cover || SOUND_IMG,
		normalized: sample.normalized,
		playing: sample.playing,
		ready: sample.ready,
		title: sample.title,
		url: sample.url
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	onMouseDown: e => {
		if (e.button === 0) dispatch(startSample(ownProps.index))
	},
	onMouseUp: e => {
		if (e.button === 0) dispatch(stopSample(ownProps.index))
	},
	onMouseEnter: e => {
		if (e.buttons) {
			// e.preventDefault()
			// e.stopPropagation()
			dispatch(startSample(ownProps.index))
		}
	},
	onMouseLeave: e => {
		if (e.buttons) {
			// e.preventDefault()
			// e.stopPropagation()
			dispatch(stopSample(ownProps.index))
		}
	},
	onTouchStart: e => {
		console.log('onTouchStart')
		e.preventDefault()
		dispatch(startSample(ownProps.index))
	},
	onTouchEnd: e => {
		console.log('onTouchEnd')
		dispatch(stopSample(ownProps.index))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Sample)
