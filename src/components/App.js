import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import StrategyDefinitions from '../controllers/strategies/StrategyDefinitions'
import Player from '../containers/Player'
import config from '../config'
import './App.css'

// --------------------------------------------------------------

const DURATIONS = [
	{ value: 0,     label: 'Full track duration' },
	{ value: 1000,  label: '1 second' },
	{ value: 2000,  label: '2 seconds' },
	{ value: 3000,  label: '3 seconds' },
	{ value: 10000, label: '10 seconds' },
	{ value: 20000, label: '20 seconds' }
]

// --------------------------------------------------------------

class InputField extends Component {
	render() {
		return (
			<div className="app-menu-field">
				<label className="app-menu-field-label">{this.props.name}</label>
				<input className="app-menu-field-control" type="number" value={this.props.value} placeholder={this.props.name} onChange={this.props.onChange} />
			</div>
		)
	}
}

class SelectField extends Component {
	render() {
		return (
			<div className="app-menu-field">
				<label className="app-menu-field-label">{this.props.name}</label>
				<select className="app-menu-field-control" onChange={this.props.onChange} value={this.props.value}>
					{this.props.items.map(item => <option key={this.props.getValue(item)} value={this.props.getValue(item)}>{this.props.getText(item)}</option>)}
				</select>
			</div>
		)
	}
}

// --------------------------------------------------------------

class App extends Component {
	render() {
		if (this.props.playlistData) {
			return (
				<div className="app">
					<Player />
				</div>
			)
		}
		else {
			return (
				<div className="app-menu">
					<div className="app-title">DZFONE</div>
					<SelectField
						name="Sampler Type"
						items={Object.entries(StrategyDefinitions)}
						value={this.props.samplingStrategy}
						onChange={this.props.onChangeSamplingStrategy}
						getValue={([strategy, strategyDefinition]) => strategy}
						getText={([strategy, strategyDefinition]) => strategyDefinition.label} />
					<SelectField
						name="Sampler Duration"
						items={DURATIONS}
						value={this.props.sampleDuration}
						onChange={this.props.onChangeSampleDuration}
						getValue={duration => duration.value}
						getText={duration => duration.label} />
					<SelectField
						name="Playlist"
						items={config.CURATED_PLAYLISTS}
						value="" onChange={this.props.onChangePlaylistId}
						getValue={playlist => playlist.id}
						getText={playlist => playlist.title} />
					<InputField
						name="Playlist ID"
						value={this.props.playlistId}
						onChange={this.props.onChangePlaylistId} />
					<div className="app-menu-field">
						<button className="app-menu-action" onClick={this.props.onLoadPlaylist}>Start</button>
					</div>
				</div>
			)
		}
	}
}

// --------------------------------------------------------------

App.propTypes = {
	playlistId: PropTypes.number,
	playlistData: PropTypes.object,
	sampleDuration: PropTypes.number,
	samplingStrategy: PropTypes.string,
	onChangeSampleDuration: PropTypes.func,
	onChangeSamplingStrategy: PropTypes.func,
	onChangePlaylistId: PropTypes.func,
	onLoadPlaylist: PropTypes.func
}

export default App
