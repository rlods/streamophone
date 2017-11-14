import { connect } from 'react-redux'
//
import Sample from '../components/Sample'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => {
	const sample = state.sampling.tracks[ownProps.index]
	return {
		cover: sample.cover,
		playing: sample.playing,
		title: sample.title,
		url: sample.url
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	// onPlay: () => dispatch(startSample(...))
})

export default connect(mapStateToProps, mapDispatchToProps)(Sample)
