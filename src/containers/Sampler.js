import { connect } from 'react-redux'
//
import { handleKeyDown, handleKeyUp } from '../actions/sampler'
import { createSampler } from '../actions/source'
import Sampler from '../components/Sampler'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	tracks: state.sampler.tracks,
	samplerStrategyId: state.sampler.strategyId
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onKeyDown: e => !e.repeat && dispatch(handleKeyDown(e.keyCode)),
	onKeyUp: e => dispatch(handleKeyUp(e.keyCode)),
	onInit: () => dispatch(createSampler())
})

export default connect(mapStateToProps, mapDispatchToProps)(Sampler)
