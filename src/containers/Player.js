import { connect } from 'react-redux'
//
import { handleKeyDown, handleKeyUp } from '../actions/sampling'
import { createSampling } from '../actions/source'
import Player from '../components/Player'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	tracks: state.sampling.tracks,
	samplingStrategyId: state.sampling.strategyId
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onKeyDown: e => !e.repeat && dispatch(handleKeyDown(e.keyCode)),
	onKeyUp: e => dispatch(handleKeyUp(e.keyCode)),
	onInit: () => dispatch(createSampling())
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
