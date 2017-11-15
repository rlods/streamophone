import { connect } from 'react-redux'
//
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
	// onPlay: () => dispatch(startSample(...))
})

export default connect(mapStateToProps, mapDispatchToProps)(Sample)
