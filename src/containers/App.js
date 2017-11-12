import { connect } from 'react-redux'
//
import { changeSampleDuration, changeSamplingStrategy } from '../actions/sampling'
import { changePlaylistId, loadPlaylist } from '../actions/playlist'
import App from '../components/App'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	playlistData: state.playlist.data,
	playlistId: state.playlist.id,
	sampleDuration: state.sampling.sampleDuration,
	samplingStrategy: state.sampling.strategy,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChangeSampleDuration: e   => dispatch(changeSampleDuration(parseInt(e.target.value, 10))),
	onChangeSamplingStrategy: e => dispatch(changeSamplingStrategy(e.target.value)),
	onChangePlaylistId: e       => dispatch(changePlaylistId(parseInt(e.target.value, 10))),
	onLoadPlaylist: ()          => dispatch(loadPlaylist()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
