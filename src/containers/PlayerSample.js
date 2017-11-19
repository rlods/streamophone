import { connect } from 'react-redux'
//
import PlayerSample from '../components/PlayerSample'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => {
	const track = state.player.tracks[ownProps.index]
	return {
		playing: track.playing,
		title: track.title,
		url: track.url
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayerSample)
