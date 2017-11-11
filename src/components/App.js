import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import { StrategyTypes } from '../controllers/strategies'
import Player from '../containers/Player'
import './App.css'

// --------------------------------------------------------------

class Field extends Component {
	render() {
		return (
			<div className="app-menu-field">
				<label className="app-menu-field-label">{this.props.name}</label>
				<input className="app-menu-field-control" type={this.props.type} value={this.props.value} placeholder={this.props.name} onChange={this.props.onChange} />
			</div>
		)
	}
}

// --------------------------------------------------------------

class App extends Component {
	render() {
		let body = null
		if (this.props.playlistData) {
			body = <Player />
		}
		else {
			body = (
				<div className="app-menu">
					<div className="app-title">DZFONE</div>
					<div className="app-menu-field">
						<label className="app-menu-field-label">Sampler Type</label>
						<select className="app-menu-field-control" onChange={this.props.onChangeSamplerType} value={this.props.samplerType}>
							{Object.values(StrategyTypes).map((strategy) =>
								<option key={strategy.id} value={strategy.id}>{strategy.label}</option>)}
						</select>
					</div>
					<div className="app-menu-field">
						<label className="app-menu-field-label">Samples Duration</label>
						<select className="app-menu-field-control" onChange={this.props.onChangeSampleDuration} value={this.props.sampleDuration}>
							<option value="0">Full track duration</option>
							<option value="1000">1 second</option>
							<option value="2000">2 seconds</option>
							<option value="3000">3 seconds</option>
							<option value="10000">10 seconds</option>
							<option value="20000">20 seconds</option>
						</select>
					</div>
					<div className="app-menu-field">
						<label className="app-menu-field-label">Playlist</label>
						<select className="app-menu-field-control" onChange={this.props.onChangePlaylistId}>
							<option value="1083902971">Hits 2017</option>
							<option value="791313621">The Greatest Piano Classics (++)</option>
							<option value="548368765">Long Playlist</option>
							<option value="3789105302">Steve Reich</option>
							<option value="10178447">Percus</option>
							<option value="3791846562">Speeches (++)</option>
							<option value="1194890603">Best of - Daft Punk</option>
							<option value="771276181">Musique concrète et électronique</option>
							<option value="3510240466">Soul to Funk</option>
							<option value="23804156">Minimal electro house</option>
						</select>
					</div>
					<Field type="number" name="Playlist ID" value={this.props.playlistId} onChange={this.props.onChangePlaylistId} />
					<div className="app-menu-field">
						<button className="app-menu-action" onClick={this.props.onLoadPlaylist}>Start</button>
					</div>
				</div>
			)
		}
		return (
			<div className="App">
				{body}
			</div>
		)
	}
}

// --------------------------------------------------------------

App.propTypes = {
	playlistId: PropTypes.number,
	playlistData: PropTypes.object,
	sampleDuration: PropTypes.number,
	samplerType: PropTypes.string,
	onChangeSampleDuration: PropTypes.func,
	onChangeSamplerType: PropTypes.func,
	onChangePlaylistId: PropTypes.func,
	onLoadPlaylist: PropTypes.func
}

export default App
