import { connect } from 'react-redux'
//
import Samples from '../components/Samples'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	audios: state.sampling.audios,
	tracks: state.sampling.tracks,
	samplerType: state.sampling.samplerType
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Samples)
