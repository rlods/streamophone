import { connect } from 'react-redux'
//
import { changeSampleDefaultDuration, changeSamplerStrategy } from '../actions/sampler'
import { changeSourceBPM, changeSourceId, changeSourceTransformation, changeSourceType, goToSampler } from '../actions/source'
import Splash from '../components/Splash'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	samplerDefaultDuration: state.sampler.defaultDuration,
	samplerStrategyId: state.sampler.strategyId,
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
	onChangeSamplerDefaultDuration: e => dispatch(changeSampleDefaultDuration(parseInt(e.target.value, 10))),
	onChangeSamplerStrategy: e        => dispatch(changeSamplerStrategy(e.target.value)),
	onChangeSourceBPM: e               => dispatch(changeSourceBPM(parseInt(e.target.value, 10))),
	onChangeSourceId: e                => dispatch(changeSourceId(e.target.value)),
	onChangeSourceTransformation: e    => dispatch(changeSourceTransformation(e.target.value)),
	onChangeSourceType: e              => dispatch(changeSourceType(e.target.value)),
	onCreate: e                        => {
		e.preventDefault()
		dispatch(goToSampler(ownProps.history))
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(Splash)
