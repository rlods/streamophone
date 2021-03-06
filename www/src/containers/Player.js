import { connect } from 'react-redux'
//
import { loadPlayer, play, pause, registerPlayerCanvas } from '../actions/player'
import Player from '../components/Player'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	playing: state.player.playing,
	tracks: state.player.tracks
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onInit: ()               => dispatch(loadPlayer(ownProps.match.params.data)),
	onPlay: ()               => dispatch(play()),
	onPause: ()              => dispatch(pause()),
	onRegisterCanvas: canvas => dispatch(registerPlayerCanvas(canvas))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
