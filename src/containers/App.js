import { connect } from 'react-redux'
//
import { changeSampleCount } from '../actions/sampling'
import { changePlaylistId, loadPlaylist } from '../actions/playlist'
import App from '../components/App'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	playlistData: state.playlist.data,
	playlistId: state.playlist.id,
	samplesCount: state.sampling.count
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChangeSampleCount: e => dispatch(changeSampleCount(parseInt(e.target.value, 10))),
	onChangePlaylistId: e  => dispatch(changePlaylistId(parseInt(e.target.value, 10))),
	onLoadPlaylist: ()     => dispatch(loadPlaylist()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
