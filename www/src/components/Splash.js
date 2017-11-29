import React, { Component } from 'react'
import PropTypes from 'prop-types'
//
import config from '../config'
import './Splash.css'

// --------------------------------------------------------------

class TextField extends Component {
	render() {
		return (
			<div className="splash-field">
				<label className="splash-field-label">{this.props.name}</label>
				<input className="splash-field-control" type="text" value={this.props.value} placeholder={this.props.name} onChange={this.props.onChange} />
			</div>
		)
	}
}

class SelectField extends Component {
	render() {
		return (
			<div className="splash-field">
				<label className="splash-field-label">{this.props.name}</label>
				<select className="splash-field-control" onChange={this.props.onChange} value={this.props.value}>
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
			<form className="splash" onSubmit={this.props.onCreate}>
				{ !config.SPLASH.SHOW_CONTROLLER_SELECTION ? null :
					<SelectField
						name="Sampling Controller"
						items={Object.entries(config.CONTROLLERS)}
						value={this.props.samplerStrategyId}
						onChange={this.props.onChangeSamplerStrategy}
						getValue={([strategyId, strategyDefinition]) => strategyId}
						getText={([strategyId, strategyDefinition]) => strategyDefinition.label} /> }
				{ !config.SPLASH.SHOW_LENGTH_SELECTION ? null :
					<SelectField
						name="Samples Length"
						items={config.SPLASH.DURATIONS}
						value={this.props.samplerDefaultDuration}
						onChange={this.props.onChangeSamplerDefaultDuration}
						getValue={duration => duration.value}
						getText={duration => duration.label} /> }
				{ !config.SPLASH.SHOW_CURATION ? null :
					<SelectField
						name="Curation"
						items={config.SPLASH.CURATED_SOURCES.sort((a, b) => a.title.localeCompare(b.title))}
						value={`${this.props.sourceType}:${this.props.sourceId}`} onChange={this.props.onChangeCurated}
						getValue={curated => `${curated.sourceType}:${curated.sourceId}`}
						getText={curated => `${curated.title} (${config.SOURCE_TYPES[curated.sourceType].label})`} /> }
				{ !config.SPLASH.SHOW_BPM ? null :
					<SelectField
						name="Adjusted BPM"
						items={config.SPLASH.BPMS}
						value={this.props.sourceBPM}
						onChange={this.props.onChangeSourceBPM}
						getValue={bpm => bpm.value}
						getText={bpm => bpm.label} /> }
				{ !config.SPLASH.SHOW_SOURCE_TRANSFORMATION ? null :
					<SelectField
						name="Transformation"
						items={Object.entries(config.SPLASH.TRANSFORMATIONS)}
						value={this.props.sourceTransformation}
						onChange={this.props.onChangeSourceTransformation}
						getValue={([transformationType, transformationLabel]) => transformationType}
						getText={([transformationType, transformationLabel]) => transformationLabel} /> }
				{ !config.SPLASH.SHOW_SOURCE_SELECTION ? null :
					<SelectField
						name="Source Type"
						items={Object.entries(config.SOURCE_TYPES)}
						value={this.props.sourceType} onChange={this.props.onChangeSourceType}
						getValue={([sourceType, sourceDef]) => sourceType}
						getText={([sourceType, sourceDef]) => sourceDef.label}
						canBeEmpty={true} /> }
				{ !config.SPLASH.SHOW_SOURCE_SELECTION ? null :
					<TextField
						name={config.SOURCE_TYPES[this.props.sourceType].input_label}
						value={this.props.sourceId}
						onChange={this.props.onChangeSourceId} /> }
				<div className="splash-field">
					<button className="splash-action" onClick={this.props.onCreate}><i className="fa fa-music" aria-hidden="true"></i></button>
				</div>
			</form>
		)
	}
}

// --------------------------------------------------------------

Splash.propTypes = {
	samplerDefaultDuration: PropTypes.number,
	samplerStrategyId: PropTypes.string,
	sourceBPM: PropTypes.number,
	sourceId: PropTypes.string,
	sourceTransformation: PropTypes.string,
	sourceType: PropTypes.string,
	onChangeCurated: PropTypes.func,
	onChangeSamplerDefaultDuration: PropTypes.func,
	onChangeSamplerStrategy: PropTypes.func,
	onChangeSourceBPM: PropTypes.func,
	onChangeSourceId: PropTypes.func,
	onChangeSourceTransformation: PropTypes.func,
	onChangeSourceType: PropTypes.func,
	onCreate: PropTypes.func
}

export default Splash
