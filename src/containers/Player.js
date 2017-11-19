import { connect } from 'react-redux'
//
import { loadPlayer, play, pause, registerPlayerCanvas } from '../actions/player'
import Player from '../components/Player'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	tracks: state.player.tracks
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onLoadPlayer: ()         => dispatch(loadPlayer(ownProps.match.params.data)),
	onPlay: ()               => dispatch(play()),
	onPause: ()              => dispatch(pause()),
	onRegisterCanvas: canvas => dispatch(registerPlayerCanvas(canvas))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
