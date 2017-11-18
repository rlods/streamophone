import { connect } from 'react-redux'
//
import AudioRecord from '../tools/AudioRecord'
import Listen from '../components/Listen'

// --------------------------------------------------------------

const mapStateToProps = (state, ownProps) => ({
	record: new AudioRecord(ownProps.match.params.data)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Listen)
