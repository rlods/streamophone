import { connect } from 'react-redux'
//
import { changeSamplerType } from '../actions/sampling'
import { changePlaylistId, loadPlaylist } from '../actions/playlist'
import App from '../components/App'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	playlistData: state.playlist.data,
	playlistId: state.playlist.id
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChangeSamplerType: e => dispatch(changeSamplerType(e.target.value)),
	onChangePlaylistId: e  => dispatch(changePlaylistId(parseInt(e.target.value, 10))),
	onLoadPlaylist: ()     => dispatch(loadPlaylist()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
