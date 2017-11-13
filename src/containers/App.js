import { connect } from 'react-redux'
//
import { changeSampleDuration, changeSamplingStrategy, changeSamplingTransformation } from '../actions/sampling'
import { changeSourceId, changeSourceType, loadSource } from '../actions/source'
import App from '../components/App'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	sourceId: state.source.id,
	sourceData: state.source.data,
	sourceType: state.source.type,
	sampleDuration: state.sampling.sampleDuration,
	samplingStrategyId: state.sampling.strategyId,
	samplingTransformation: state.sampling.transformation
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChangeCurated: e          => {
		const [ sourceType, sourceId ] = e.target.value.split(':')
		dispatch(changeSourceId(sourceId))
		dispatch(changeSourceType(sourceType))
	},
	onChangeSampleDuration: e         => dispatch(changeSampleDuration(parseInt(e.target.value, 10))),
	onChangeSamplingStrategy: e       => dispatch(changeSamplingStrategy(e.target.value)),
	onChangeSamplingTransformation: e => dispatch(changeSamplingTransformation(e.target.value)),
	onChangeSourceId: e               => dispatch(changeSourceId(e.target.value)),
	onChangeSourceType: e             => dispatch(changeSourceType(e.target.value)),
	onLoadPlaylist: ()                => dispatch(loadSource()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
