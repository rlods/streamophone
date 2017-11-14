import { connect } from 'react-redux'
//
import App from '../components/App'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	samplingTracks: state.sampling.tracks
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
