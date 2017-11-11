import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Player from '../containers/Player'
import './App.css'

// --------------------------------------------------------------

class Field extends Component {
	render() {
		return (
			<div className="app-field">
				<input className="control" type={this.props.type} value={this.props.value} placeholder={this.props.name} onChange={this.props.onChange} />
			</div>
		)
	}
}

// --------------------------------------------------------------

class App extends Component {
	render() {
		return (
			<div className="App">
				<div className="app-body">
					{this.props.playlistData ? <Player /> : null}
				</div>
				<div className="app-menu">
					<div className="app-fields">
						<div className="app-field">
							<select className="control" onChange={this.props.onChangePlaylistId}>
								<option value="1083902971">Hits 2017</option>
								<option value="791313621">The Greatest Piano Classics</option>
								<option value="548368765">Long Playlist</option>
								<option value="3789105302">Steve Reich</option>
							</select>
						</div>
						<Field type="number" name="Playlist ID" value={this.props.playlistId} onChange={this.props.onChangePlaylistId} />
					</div>
					<div className="app-fields">
						<div className="app-field">
							<select className="control" onChange={this.props.onChangeSamplerType}>
								<option value="">Sampler Type...</option>
								<option value="buttons">Buttons</option>
								<option value="singleslider">Single Slider</option>
								<option value="multisliders8">Multi Sliders 8</option>
							</select>
						</div>
						<Field type="number" name="Sample Count" value={this.props.samplesCount} onChange={this.props.onChangeSampleCount} />
					</div>
					<div className="app-fields">
						<div className="app-field">
							<button className="control" onClick={this.props.onLoadPlaylist}>Load playlist</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

// --------------------------------------------------------------

App.propTypes = {
	playlistId: PropTypes.number,
	playlistData: PropTypes.object,
	samplesCount: PropTypes.number,
	onChangeSampleCount: PropTypes.func,
	onChangeSamplerType: PropTypes.func,
	onChangePlaylistId: PropTypes.func,
	onLoadPlaylist: PropTypes.func
}

export default App
