import { connect } from 'react-redux'
//
import App from '../components/App'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	ready: !!state.sampler.tracks // So that the App component is re-evaluated when needed
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
