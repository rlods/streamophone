import { connect } from 'react-redux'
//
import { loadPlayer } from '../actions/player'
import Player from '../components/Player'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	record: state.player.record
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onLoadPlayer: () => dispatch(loadPlayer(ownProps.match.params.data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
