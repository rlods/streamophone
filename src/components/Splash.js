import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import config from '../config'
import './Splash.css'

// --------------------------------------------------------------

const BPMS = [
	{ value: 50,  label: '50 (Tango)'  },
	{ value: 110, label: '110 (New Beat)' },
	{ value: 128, label: '128 (Trance)' },
	{ value: 195, label: '195 (Speedcore)' },
	{ value: -1,  label: 'Default' }
]

const DURATIONS = [
	{ value: 1000,  label: '1 second' },
	{ value: 2000,  label: '2 seconds' },
	{ value: 3000,  label: '3 seconds' },
	{ value: 10000, label: '10 seconds' },
	{ value: 20000, label: '20 seconds' },
	{ value: -1,    label: 'Full' }
]

const SOURCE_TYPES = {
	deezer_album: 'Deezer Album',
	deezer_artist: 'Deezer Artist',
	deezer_playlist: 'Deezer Playlist',
	freesound_pack: 'Freesound Pack',
	spotify_album: 'Spotify Album',
	spotify_artist: 'Spotify Artist'
}

const TRANSFORMATIONS = {
	none: 'None',
	shuffle: 'Shuffle'
}

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

class Splash extends Component {
	render() {
		return (
			<form className="app-menu" onSubmit={this.props.onCreate}>
				<div className="app-title">The Streamophone</div>
				<SelectField
					name="Sample Controller"
					items={Object.entries(config.STRATEGIES)}
					value={this.props.samplingStrategyId}
					onChange={this.props.onChangeSamplingStrategy}
					getValue={([strategyId, strategyDefinition]) => strategyId}
					getText={([strategyId, strategyDefinition]) => strategyDefinition.label} />
				<SelectField
					name="Sample Duration"
					items={DURATIONS}
					value={this.props.samplingDefaultDuration}
					onChange={this.props.onChangeSamplingDefaultDuration}
					getValue={duration => duration.value}
					getText={duration => duration.label} />
				<SelectField
					name="Curated Sources"
					items={config.CURATED_SOURCES}
					value={`${this.props.sourceType}:${this.props.sourceId}`} onChange={this.props.onChangeCurated}
					getValue={curated => `${curated.sourceType}:${curated.sourceId}`}
					getText={curated => `${SOURCE_TYPES[curated.sourceType]} / ${curated.title}`} />
				<SelectField
					name="Source BPM"
					items={BPMS}
					value={this.props.sourceBPM}
					onChange={this.props.onChangeSourceBPM}
					getValue={bpm => bpm.value}
					getText={bpm => bpm.label} />
				<SelectField
					name="Source Transformation"
					items={Object.entries(TRANSFORMATIONS)}
					value={this.props.sourceTransformation}
					onChange={this.props.onChangeSourceTransformation}
					getValue={([transformationType, transformationLabel]) => transformationType}
					getText={([transformationType, transformationLabel]) => transformationLabel} />
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
					<button className="app-menu-action" onClick={this.props.onCreate}>Play</button>
				</div>
			</form>
		)
	}
}

// --------------------------------------------------------------

Splash.propTypes = {
	samplingDefaultDuration: PropTypes.number,
	samplingStrategyId: PropTypes.string,
	sourceBPM: PropTypes.number,
	sourceId: PropTypes.string,
	sourceTransformation: PropTypes.string,
	sourceType: PropTypes.string,
	onChangeCurated: PropTypes.func,
	onChangeSamplingDefaultDuration: PropTypes.func,
	onChangeSamplingStrategy: PropTypes.func,
	onChangeSourceBPM: PropTypes.func,
	onChangeSourceId: PropTypes.func,
	onChangeSourceTransformation: PropTypes.func,
	onChangeSourceType: PropTypes.func,
	onCreate: PropTypes.func
}

export default Splash
