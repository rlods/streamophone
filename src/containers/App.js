import { connect } from 'react-redux'
//
import { changeSampleCount, changeSampleDuration, playSample } from '../actions/sampling'
import { changePlaylistId, loadPlaylist } from '../actions/playlist'
import App from '../components/App'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	playlistId: state.playlist.id,
	playlistLoaded: state.playlist.loaded,
	sampleCount: state.sampling.count,
	sampleDuration: state.sampling.duration
})

const A_CHAR_CODE = 'a'.charCodeAt()

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChangeSampleCount: e    => dispatch(changeSampleCount(parseInt(e.target.value, 10))),
	onChangeSampleDuration: e => dispatch(changeSampleDuration(parseInt(e.target.value, 10))),
	onChangePlaylistId: e     => dispatch(changePlaylistId(parseInt(e.target.value, 10))),
	onLoadPlaylist: ()        => dispatch(loadPlaylist()),
	onPlay: e                 => dispatch(playSample(e.charCode - A_CHAR_CODE))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
