import React from 'react'
import PropTypes from 'prop-types'
//
import config from '../config'
import './Splash.css'

// --------------------------------------------------------------

const TextField = ({ name, value, onChange }) => (
	<div className="splash-field">
		<label className="splash-field-label">{name}</label>
		<input className="splash-field-control" type="text" value={value} placeholder={name} onChange={onChange} />
	</div>
)

const SelectField = ({ name, value, items, getValue, getText, onChange }) => (
	<div className="splash-field">
		<label className="splash-field-label">{name}</label>
		<select className="splash-field-control" onChange={onChange} value={value}>
			{items.map(item => <option key={getValue(item)} value={getValue(item)}>{getText(item)}</option>)}
		</select>
	</div>
)

// --------------------------------------------------------------

const Splash = ({
	samplerDefaultDuration,
	samplerStrategyId,
	sourceBPM,
	sourceId,
	sourceTransformation,
	sourceType,
	onChangeCurated,
	onChangeSamplerDefaultDuration,
	onChangeSamplerStrategy,
	onChangeSourceBPM,
	onChangeSourceId,
	onChangeSourceTransformation,
	onChangeSourceType,
	onCreate
}) => (
	<form className="splash" onSubmit={onCreate}>
		{ !config.SPLASH.SHOW_CONTROLLER_SELECTION ? null :
			<SelectField
				name="Sampling Controller"
				items={Object.entries(config.CONTROLLERS)}
				value={samplerStrategyId}
				onChange={onChangeSamplerStrategy}
				getValue={([strategyId, strategyDefinition]) => strategyId}
				getText={([strategyId, strategyDefinition]) => strategyDefinition.label} /> }
		{ !config.SPLASH.SHOW_LENGTH_SELECTION ? null :
			<SelectField
				name="Samples Length"
				items={config.SPLASH.DURATIONS}
				value={samplerDefaultDuration}
				onChange={onChangeSamplerDefaultDuration}
				getValue={duration => duration.value}
				getText={duration => duration.label} /> }
		{ !config.SPLASH.SHOW_CURATION ? null :
			<SelectField
				name="Curation"
				items={config.SPLASH.CURATED_SOURCES.sort((a, b) => a.title.localeCompare(b.title))}
				value={`${sourceType}:${sourceId}`} onChange={onChangeCurated}
				getValue={curated => `${curated.sourceType}:${curated.sourceId}`}
				getText={curated => `${curated.title} (${config.SOURCE_TYPES[curated.sourceType].label})`} /> }
		{ !config.SPLASH.SHOW_BPM ? null :
			<SelectField
				name="Adjusted BPM"
				items={config.SPLASH.BPMS}
				value={sourceBPM}
				onChange={onChangeSourceBPM}
				getValue={bpm => bpm.value}
				getText={bpm => bpm.label} /> }
		{ !config.SPLASH.SHOW_SOURCE_TRANSFORMATION ? null :
			<SelectField
				name="Transformation"
				items={Object.entries(config.SPLASH.TRANSFORMATIONS)}
				value={sourceTransformation}
				onChange={onChangeSourceTransformation}
				getValue={([transformationType, transformationLabel]) => transformationType}
				getText={([transformationType, transformationLabel]) => transformationLabel} /> }
		{ !config.SPLASH.SHOW_SOURCE_SELECTION ? null :
			<SelectField
				name="Source Type"
				items={Object.entries(config.SOURCE_TYPES)}
				value={sourceType} onChange={onChangeSourceType}
				getValue={([sourceType, sourceDef]) => sourceType}
				getText={([sourceType, sourceDef]) => sourceDef.label} /> }
		{ !config.SPLASH.SHOW_SOURCE_SELECTION ? null :
			<TextField
				name={config.SOURCE_TYPES[sourceType].input_label}
				value={sourceId}
				onChange={onChangeSourceId} /> }
		<div className="splash-field">
			<button className="splash-action" onClick={onCreate}><i className="fa fa-music" aria-hidden="true"></i></button>
		</div>
	</form>
)

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
