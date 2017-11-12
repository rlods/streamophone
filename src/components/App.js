import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import Player from '../containers/Player'
import config from '../config'
import './App.css'

// --------------------------------------------------------------

const DURATIONS = [
	{ value: 1000,  label: '1 second' },
	{ value: 2000,  label: '2 seconds' },
	{ value: 3000,  label: '3 seconds' },
	{ value: 10000, label: '10 seconds' },
	{ value: 20000, label: '20 seconds' },
	{ value: 0,     label: 'Full' }
]

// --------------------------------------------------------------

class TextField extends Component {
	render() {
		return (
			<div className="app-menu-field">
				<label className="app-menu-field-label">{this.props.name}</label>
				<input className="app-menu-field-control" type="text" value={this.props.value} placeholder={this.props.name} onChange={this.props.onChange} />
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

const SOURCE_TYPES = {
	album: 'Album',
	artist: 'Artist',
	playlist: 'Playlist'
}

class App extends Component {
	render() {
		if (this.props.sourceData) {
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
						name="Controller"
						items={Object.entries(config.STRATEGIES)}
						value={this.props.samplingStrategyId}
						onChange={this.props.onChangeSamplingStrategy}
						getValue={([strategyId, strategyDefinition]) => strategyId}
						getText={([strategyId, strategyDefinition]) => strategyDefinition.label} />
					<SelectField
						name="Sample Duration"
						items={DURATIONS}
						value={this.props.sampleDuration}
						onChange={this.props.onChangeSampleDuration}
						getValue={duration => duration.value}
						getText={duration => duration.label} />
					<SelectField
						name="Curated"
						items={config.CURATED_SOURCES}
						value={`${this.props.sourceType}:${this.props.sourceId}`} onChange={this.props.onChangeCurated}
						getValue={curated => `${curated.sourceType}:${curated.sourceId}`}
						getText={curated => `${SOURCE_TYPES[curated.sourceType]} / ${curated.title}`} />
					<SelectField
						name="Source Type"
						items={Object.entries(SOURCE_TYPES)}
						value={this.props.sourceType} onChange={this.props.onChangeSourceType}
						getValue={([sourceType, sourceLabel]) => sourceType}
						getText={([sourceType, sourceLabel]) => sourceLabel}
						canBeEmpty={true} />
					<TextField
						name="Source ID"
						value={this.props.sourceId}
						onChange={this.props.onChangeSourceId} />
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
	sampleDuration: PropTypes.number,
	samplingStrategyId: PropTypes.string,
	sourceData: PropTypes.object,
	sourceId: PropTypes.string,
	sourceType: PropTypes.string,
	onChangeCurated: PropTypes.func,
	onChangeSampleDuration: PropTypes.func,
	onChangeSamplingStrategy: PropTypes.func,
	onChangeSourceId: PropTypes.func,
	onChangeSourceType: PropTypes.func,
	onLoadPlaylist: PropTypes.func
}

export default App
