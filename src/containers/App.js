import { connect } from 'react-redux'
//
import { changeSampleCount, changeSampleDuration } from '../actions/sampling'
import { changePlaylistId, loadPlaylist } from '../actions/playlist'
import App from '../components/App'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	playlistId: state.playlist.id,
	sampleCount: state.sampling.count,
	sampleDuration: state.sampling.duration
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChangeSampleCount: e    => dispatch(changeSampleCount(parseInt(e.target.value, 10))),
	onChangeSampleDuration: e => dispatch(changeSampleDuration(parseInt(e.target.value, 10))),
	onChangePlaylistId: e     => dispatch(changePlaylistId(parseInt(e.target.value, 10))),
	onLoadPlaylist: ()        => dispatch(loadPlaylist())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
