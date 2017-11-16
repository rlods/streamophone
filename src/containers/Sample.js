import { connect } from 'react-redux'
//
import { registerSampleCanvas, startSample, stopSample } from '../actions/sampling'
import Sample from '../components/Sample'

// --------------------------------------------------------------

const SOUND_IMG = require('../assets/sound.png')

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => {
	const track = state.sampling.tracks[ownProps.index]
	return {
		bpm: Math.floor(track.bpm),
		cover: track.cover || SOUND_IMG,
		normalized: track.normalized,
		playing: track.playing,
		ready: track.ready,
		speed: track.speed.toFixed(2),
		title: track.title,
		url: track.url
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
	},
	onRegisterCanvas: canvas => {
		dispatch(registerSampleCanvas(ownProps.index, canvas))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Sample)
