import { connect } from 'react-redux'
//
import Sample from '../components/Sample'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => {
	const track = state.sampling.tracks.find(other => other.id === ownProps.id)
	return {
		cover: track.cover,
		playing: track.playing,
		title: track.title
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	// onPlay: () => dispatch(startSample(...))
})

export default connect(mapStateToProps, mapDispatchToProps)(Sample)
