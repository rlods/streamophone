import { connect } from 'react-redux'
//
import { changeSampleDefaultDuration, changeSamplingStrategy } from '../actions/sampling'
import { changeSourceBPM, changeSourceId, changeSourceTransformation, changeSourceType, goToSampling } from '../actions/source'
import Splash from '../components/Splash'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	samplingDefaultDuration: state.sampling.defaultDuration,
	samplingStrategyId: state.sampling.strategyId,
	sourceBPM: state.source.bpm,
	sourceId: state.source.id,
	sourceTransformation: state.source.transformation,
	sourceType: state.source.type
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChangeCurated: e => {
		const [ sourceType, sourceId ] = e.target.value.split(':')
		dispatch(changeSourceId(sourceId))
		dispatch(changeSourceType(sourceType))
	},
	onChangeSamplingDefaultDuration: e => dispatch(changeSampleDefaultDuration(parseInt(e.target.value, 10))),
	onChangeSamplingStrategy: e        => dispatch(changeSamplingStrategy(e.target.value)),
	onChangeSourceBPM: e               => dispatch(changeSourceBPM(parseInt(e.target.value, 10))),
	onChangeSourceId: e                => dispatch(changeSourceId(e.target.value)),
	onChangeSourceTransformation: e    => dispatch(changeSourceTransformation(e.target.value)),
	onChangeSourceType: e              => dispatch(changeSourceType(e.target.value)),
	onCreate: e                        => {
		e.preventDefault()
		dispatch(goToSampling(ownProps.history))
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(Splash)
