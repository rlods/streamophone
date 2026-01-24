import React, { useCallback } from 'react'
import { useNavigate, NavigateFunction } from 'react-router-dom'
//
import type { ControllerDef, DurationOption, CuratedSource, BpmOption, SourceTypeDef } from '../types'
import { useSamplerStore, useSourceStore, goToSampler } from '../stores'
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

const Splash: React.FC = () => {
	const navigate: NavigateFunction = useNavigate()

	const samplerDefaultDuration = useSamplerStore((state) => state.defaultDuration)
	const samplerStrategyId = useSamplerStore((state) => state.strategyId)
	const setDefaultDuration = useSamplerStore((state) => state.setDefaultDuration)
	const setStrategy = useSamplerStore((state) => state.setStrategy)

	const sourceBPM = useSourceStore((state) => state.bpm)
	const sourceId = useSourceStore((state) => state.id)
	const sourceTransformation = useSourceStore((state) => state.transformation)
	const sourceType = useSourceStore((state) => state.type)
	const setBpm = useSourceStore((state) => state.setBpm)
	const setId = useSourceStore((state) => state.setId)
	const setTransformation = useSourceStore((state) => state.setTransformation)
	const setType = useSourceStore((state) => state.setType)

	const onChangeCurated = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		const [sourceType, sourceId] = e.target.value.split(':')
		setId(sourceId)
		setType(sourceType)
	}, [setId, setType])

	const onChangeSamplerDefaultDuration = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setDefaultDuration(parseInt(e.target.value, 10))
	}, [setDefaultDuration])

	const onChangeSamplerStrategy = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setStrategy(e.target.value)
	}, [setStrategy])

	const onChangeSourceBPM = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setBpm(parseInt(e.target.value, 10))
	}, [setBpm])

	const onChangeSourceId = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
		setId(e.target.value)
	}, [setId])

	const onChangeSourceTransformation = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setTransformation(e.target.value)
	}, [setTransformation])

	const onChangeSourceType = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setType(e.target.value)
	}, [setType])

	const onCreate = useCallback((e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault()
		goToSampler(navigate)
	}, [navigate])

	return (
		<form className="splash" onSubmit={onCreate}>
			{ !config.SPLASH.SHOW_CONTROLLER_SELECTION ? null :
				<SelectField<[string, ControllerDef]>
					name="Sampling Controller"
					items={Object.entries(config.CONTROLLERS)}
					value={samplerStrategyId}
					onChange={onChangeSamplerStrategy}
					getValue={([strategyId]: [string, ControllerDef]) => strategyId}
					getText={([, strategyDefinition]: [string, ControllerDef]) => strategyDefinition.label} /> }
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
					getValue={([transformationType]: [string, string]) => transformationType}
					getText={([, transformationLabel]: [string, string]) => transformationLabel} /> }
			{ !config.SPLASH.SHOW_SOURCE_SELECTION ? null :
				<SelectField<[string, SourceTypeDef]>
					name="Source Type"
					items={Object.entries(config.SOURCE_TYPES)}
					value={sourceType} onChange={onChangeSourceType}
					getValue={([sourceType]: [string, SourceTypeDef]) => sourceType}
					getText={([, sourceDef]: [string, SourceTypeDef]) => sourceDef.label} /> }
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
}

// --------------------------------------------------------------

export default Splash
