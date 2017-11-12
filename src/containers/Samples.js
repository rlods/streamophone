import { connect } from 'react-redux'
//
import Samples from '../components/Samples'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	audios: state.sampling.audios,
	tracks: state.sampling.tracks,
	samplingStrategyId: state.sampling.strategyId
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Samples)
