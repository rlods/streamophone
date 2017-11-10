import React, { Component } from 'react'
import './App.css'
import PropTypes from 'prop-types'

class Field extends Component {
	render() {
		return (
			<div className="Field">
				<label>{this.props.name}</label>
				<input type="number" value={this.props.value} placeholder={this.props.name} onChange={this.props.onChange} />
			</div>
		)
	}
}

class App extends Component {
	render() {
		return (
			<div className="App">
				<div>
					<Field name="Playlist ID" value={this.props.playlistId} onChange={this.props.onChangePlaylistId} />
					<Field name="Sample Count" value={this.props.sampleCount} onChange={this.props.onChangeSampleCount} />
					<Field name="Sample Duration" value={this.props.sampleDuration} onChange={this.props.onChangeSampleDuration} />
				</div>
				<div>
					<button onClick={this.props.onLoadPlaylist}>Load playlist</button>
				</div>
				<div>
					<span>Loaded: {this.props.playlistId}</span>
				</div>
			</div>
		)
	}
}

App.propTypes = {
	playlistId: PropTypes.number,
	sampleCount: PropTypes.number,
	sampleDuration: PropTypes.number,
	onChangeSampleCount: PropTypes.func,
	onChangeSampleDuration: PropTypes.func,
	onChangePlaylistId: PropTypes.func,
	onLoadPlaylist: PropTypes.func
}

export default App
