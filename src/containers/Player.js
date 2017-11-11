import { connect } from 'react-redux'
//
import { startSample, stopSample } from '../actions/sampling'
import Player from '../components/Player'

// --------------------------------------------------------------

const A_CHAR_CODE = 65

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	playlistTitle: state.playlist.data.title,
	playlistUrl: state.playlist.data.link
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onPlayStart: e => !e.repeat && dispatch(startSample(e.keyCode - A_CHAR_CODE)),
	onPlayStop: e  => dispatch(stopSample(e.keyCode - A_CHAR_CODE))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
