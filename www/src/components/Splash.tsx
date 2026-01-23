import React from 'react'
//
import type { ControllerDef, DurationOption, CuratedSource, BpmOption, SourceTypeDef } from '../types'
import config from '../config'
import './Splash.css'

// --------------------------------------------------------------

interface TextFieldProps {
	name: string
	value: string
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const TextField: React.FC<TextFieldProps> = ({ name, value, onChange }) => (
	<div className="splash-field">
		<label className="splash-field-label">{name}</label>
		<input className="splash-field-control" type="text" value={value} placeholder={name} onChange={onChange} />
	</div>
)

interface SelectFieldProps<T> {
	name: string
	value: string | number
	items: T[]
	getValue: (item: T) => string | number
	getText: (item: T) => string
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

function SelectField<T>({ name, value, items, getValue, getText, onChange }: SelectFieldProps<T>): React.ReactElement {
	return (
		<div className="splash-field">
			<label className="splash-field-label">{name}</label>
			<select className="splash-field-control" onChange={onChange} value={value}>
				{items.map((item: T) => <option key={getValue(item)} value={getValue(item)}>{getText(item)}</option>)}
			</select>
		</div>
	)
}

// --------------------------------------------------------------

interface SplashProps {
	samplerDefaultDuration: number
	samplerStrategyId: string
	sourceBPM: number
	sourceId: string
	sourceTransformation: string
	sourceType: string
	onChangeCurated: (event: React.ChangeEvent<HTMLSelectElement>) => void
	onChangeSamplerDefaultDuration: (event: React.ChangeEvent<HTMLSelectElement>) => void
	onChangeSamplerStrategy: (event: React.ChangeEvent<HTMLSelectElement>) => void
	onChangeSourceBPM: (event: React.ChangeEvent<HTMLSelectElement>) => void
	onChangeSourceId: (event: React.ChangeEvent<HTMLInputElement>) => void
	onChangeSourceTransformation: (event: React.ChangeEvent<HTMLSelectElement>) => void
	onChangeSourceType: (event: React.ChangeEvent<HTMLSelectElement>) => void
	onCreate: (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void
}

const Splash: React.FC<SplashProps> = ({
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
			<SelectField<[string, ControllerDef]>
				name="Sampling Controller"
				items={Object.entries(config.CONTROLLERS)}
				value={samplerStrategyId}
				onChange={onChangeSamplerStrategy}
				getValue={([strategyId, strategyDefinition]: [string, ControllerDef]) => strategyId}
				getText={([strategyId, strategyDefinition]: [string, ControllerDef]) => strategyDefinition.label} /> }
		{ !config.SPLASH.SHOW_LENGTH_SELECTION ? null :
			<SelectField<DurationOption>
				name="Samples Length"
				items={config.SPLASH.DURATIONS}
				value={samplerDefaultDuration}
				onChange={onChangeSamplerDefaultDuration}
				getValue={(duration: DurationOption) => duration.value}
				getText={(duration: DurationOption) => duration.label} /> }
		{ !config.SPLASH.SHOW_CURATION ? null :
			<SelectField<CuratedSource>
				name="Curation"
				items={config.SPLASH.CURATED_SOURCES.sort((a: CuratedSource, b: CuratedSource) => a.title.localeCompare(b.title))}
				value={`${sourceType}:${sourceId}`} onChange={onChangeCurated}
				getValue={(curated: CuratedSource) => `${curated.sourceType}:${curated.sourceId}`}
				getText={(curated: CuratedSource) => `${curated.title} (${config.SOURCE_TYPES[curated.sourceType].label})`} /> }
		{ !config.SPLASH.SHOW_BPM ? null :
			<SelectField<BpmOption>
				name="Adjusted BPM"
				items={config.SPLASH.BPMS}
				value={sourceBPM}
				onChange={onChangeSourceBPM}
				getValue={(bpm: BpmOption) => bpm.value}
				getText={(bpm: BpmOption) => bpm.label} /> }
		{ !config.SPLASH.SHOW_SOURCE_TRANSFORMATION ? null :
			<SelectField<[string, string]>
				name="Transformation"
				items={Object.entries(config.SPLASH.TRANSFORMATIONS)}
				value={sourceTransformation}
				onChange={onChangeSourceTransformation}
				getValue={([transformationType, transformationLabel]: [string, string]) => transformationType}
				getText={([transformationType, transformationLabel]: [string, string]) => transformationLabel} /> }
		{ !config.SPLASH.SHOW_SOURCE_SELECTION ? null :
			<SelectField<[string, SourceTypeDef]>
				name="Source Type"
				items={Object.entries(config.SOURCE_TYPES)}
				value={sourceType} onChange={onChangeSourceType}
				getValue={([sourceType, sourceDef]: [string, SourceTypeDef]) => sourceType}
				getText={([sourceType, sourceDef]: [string, SourceTypeDef]) => sourceDef.label} /> }
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

export default Splash
