import { connect } from 'react-redux'
//
import { changeSampleDuration, changeSamplerType, } from '../actions/sampling'
import { changePlaylistId, loadPlaylist } from '../actions/playlist'
import App from '../components/App'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	playlistData: state.playlist.data,
	playlistId: state.playlist.id,
	sampleDuration: state.sampling.sampleDuration,
	samplerType: state.sampling.samplerType,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChangeSampleDuration: e => dispatch(changeSampleDuration(parseInt(e.target.value, 10))),
	onChangeSamplerType: e    => dispatch(changeSamplerType(e.target.value)),
	onChangePlaylistId: e     => dispatch(changePlaylistId(parseInt(e.target.value, 10))),
	onLoadPlaylist: ()        => dispatch(loadPlaylist()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
