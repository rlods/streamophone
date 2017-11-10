import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Player from '../containers/Player'
import './App.css'

// --------------------------------------------------------------

class Field extends Component {
	render() {
		return (
			<div className="Field">
				<label>{this.props.name}</label>
				<input type={this.props.type} value={this.props.value} placeholder={this.props.name} onChange={this.props.onChange} />
			</div>
		)
	}
}

// --------------------------------------------------------------

class App extends Component {
	render() {
		return (
			<div className="App">
				<div>
					<Field type="number" name="Playlist ID" value={this.props.playlistId} onChange={this.props.onChangePlaylistId} />
					<Field type="number" name="Sample Count" value={this.props.sampleCount} onChange={this.props.onChangeSampleCount} />
				</div>
				<div>
					<button onClick={this.props.onLoadPlaylist}>Load playlist</button>
				</div>
				<div>
					{this.props.playlistLoaded ? <Player /> : null}
				</div>
			</div>
		)
	}
}

// --------------------------------------------------------------

App.propTypes = {
	playlistId: PropTypes.number,
	playlistLoaded: PropTypes.bool,
	sampleCount: PropTypes.number,
	onChangeSampleCount: PropTypes.func,
	onChangePlaylistId: PropTypes.func,
	onLoadPlaylist: PropTypes.func
}

export default App
