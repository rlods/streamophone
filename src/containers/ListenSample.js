import { connect } from 'react-redux'
//
import ListenSample from '../components/ListenSample'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => {
	const track = state.player.record.data.tracks[ownProps.index]
	console.log(track)
	return {
		title: track.title,
		url: track.url
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ListenSample)
