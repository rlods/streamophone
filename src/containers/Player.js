import { connect } from 'react-redux'
//
import { handleKeyDown, handleKeyUp } from '../actions/sampling'
import Player from '../components/Player'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onKeyDown: e => !e.repeat && dispatch(handleKeyDown(e.keyCode)),
	onKeyUp: e  => dispatch(handleKeyUp(e.keyCode))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
