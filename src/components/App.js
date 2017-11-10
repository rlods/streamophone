import React, { Component } from 'react'
import './App.css'
import PropTypes from 'prop-types'

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

class Player extends Component {
	render() {
		return (
			<div className="Field">
				<label>Player</label>
				<input type={this.props.type} value="" placeholder="Player..." onKeyPress={this.props.onPlay} />
			</div>
		)
	}
}

class App extends Component {
	render() {
		return (
			<div className="App">
				<div>
					<Field type="number" name="Playlist ID" value={this.props.playlistId} onChange={this.props.onChangePlaylistId} />
					<Field type="number" name="Sample Count" value={this.props.sampleCount} onChange={this.props.onChangeSampleCount} />
					<Field type="number" name="Sample Duration" value={this.props.sampleDuration} onChange={this.props.onChangeSampleDuration} />
					<Player onPlay={this.props.onPlay} />
				</div>
				<div>
					<button onClick={this.props.onLoadPlaylist}>Load playlist</button>
				</div>
				<div>
					<span>{this.props.loaded ? 'Loaded' : 'Not Loaded'}</span>
				</div>
			</div>
		)
	}
}

App.propTypes = {
	playlistId: PropTypes.number,
	playlistLoaded: PropTypes.bool,
	sampleCount: PropTypes.number,
	sampleDuration: PropTypes.number,
	onChangeSampleCount: PropTypes.func,
	onChangeSampleDuration: PropTypes.func,
	onChangePlaylistId: PropTypes.func,
	onLoadPlaylist: PropTypes.func,
	onPlay: PropTypes.func
}

export default App
