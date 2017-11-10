import { connect } from 'react-redux'
//
import Samples from '../components/Sampling'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	audios: state.sampling.audios,
	tracks: state.sampling.tracks
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Samples)
