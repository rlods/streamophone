import { connect } from 'react-redux'
//
import PlayerSample from '../components/PlayerSample'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => {
	const track = state.player.tracks[ownProps.index]
	return {
		playing: track.playing,
		ready: track.ready,
		title: track.title,
		totalDuration: track.totalDuration,
		url: track.url
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayerSample)
