import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
//
import { chunkArray } from '../tools'
import SamplerSample from '../containers/SamplerSample'
import { KEY_ORDER_AZERTY, KEY_ORDER_QWERTY } from '../tools'
import './Sampler.css'

// --------------------------------------------------------------

const Sampler = ({ strategyId, tracks, onKeyDown, onKeyUp, onInit }) => {
	useEffect(() => {
		document.addEventListener('keydown', onKeyDown)
		document.addEventListener('keyup', onKeyUp)

		if (null === tracks) {
			onInit() // Because user directly opened the page directly not from the splash screen
		}

		return () => {
			document.removeEventListener('keydown', onKeyDown)
			document.removeEventListener('keyup', onKeyUp)
		}
	}, [onKeyDown, onKeyUp, tracks, onInit])

	if (null !== tracks) {
		let chunkSize, body, layoutClassName = strategyId
		switch (strategyId)
		{
			case 'KEYBOARD_AZERTY':
			case 'KEYBOARD_QWERTY':
				const keys = (strategyId === 'KEYBOARD_AZERTY' ? KEY_ORDER_AZERTY : KEY_ORDER_QWERTY).toUpperCase()
				layoutClassName = 'KEYBOARD'
				body = [
					tracks.slice(0, 10),
					tracks.slice(10, 20),
					tracks.slice(20)
				].map((row, rowIndex) => <div className="samples-group samples-group-by-row" key={rowIndex}>{row.map((sample, sampleIndex) => <SamplerSample key={sampleIndex} index={rowIndex * 10 + sampleIndex} info={keys[rowIndex * 10 + sampleIndex]} />)}</div>)
				break

			case 'BCF2000_MULTISLIDERS':
				chunkSize = Math.floor(tracks.length / 8)
				body = chunkArray(tracks, chunkSize).map((chunk, chunkIndex) => <div className="samples-group samples-group-by-col" key={chunkIndex}>{chunk.map((sample, sampleIndex) => <SamplerSample key={sampleIndex} index={chunkIndex * chunkSize + sampleIndex} />)}</div>)
				break

			case 'LIGHTPADBLOCK_4':
			case 'LIGHTPADBLOCK_16':
				layoutClassName = 'LIGHTPADBLOCK'
				chunkSize = Math.sqrt(tracks.length)
				body = chunkArray(tracks, chunkSize).map((chunk, chunkIndex) => <div className="samples-group samples-group-by-row" key={chunkIndex}>{chunk.map((sample, sampleIndex) => <SamplerSample key={sampleIndex} index={chunkIndex * chunkSize + sampleIndex} />)}</div>)
				break

			case 'CUSTOM_SOCKET_STRATEGY':
				chunkSize = Math.floor(tracks.length / 5)
				body = chunkArray(tracks, chunkSize).map((chunk, chunkIndex) => <div className="samples-group samples-group-by-col" key={chunkIndex}>{chunk.map((sample, sampleIndex) => <SamplerSample key={sampleIndex} index={chunkIndex * chunkSize + sampleIndex} />)}</div>)
				break

			case 'KORG_NANOKEY2':
				body = [
					<div className="samples-group samples-group-by-row" key={0}>
						<SamplerSample index={1} />
						<SamplerSample index={3} />
						<SamplerSample index={6} />
						<SamplerSample index={8} />
						<SamplerSample index={10} />
						<SamplerSample index={13} />
						<SamplerSample index={15} />
						<SamplerSample index={18} />
						<SamplerSample index={20} />
						<SamplerSample index={22} />
					</div>,
					<div className="samples-group samples-group-by-row" key={1}>
						<SamplerSample index={0} />
						<SamplerSample index={2} />
						<SamplerSample index={4} />
						<SamplerSample index={5} />
						<SamplerSample index={7} />
						<SamplerSample index={9} />
						<SamplerSample index={11} />
						<SamplerSample index={12} />
						<SamplerSample index={14} />
						<SamplerSample index={16} />
						<SamplerSample index={17} />
						<SamplerSample index={19} />
						<SamplerSample index={21} />
						<SamplerSample index={23} />
						<SamplerSample index={24} />
					</div>
				]
				break

			default:
				body = tracks.map((sample, sampleIndex) => <SamplerSample key={sampleIndex} index={sampleIndex} />)
				break
		}

		const info = true ? null : <div className="sampler-info">...</div>

		return (
			<div className={classNames('sampler', strategyId, layoutClassName)}>
				{info}
				{body}
			</div>
		)
	}
	else {
		return null // onInit will be called to load tracks
	}
}

// --------------------------------------------------------------

Sampler.propTypes = {
	strategyId: PropTypes.string,
	tracks: PropTypes.array,
	//
	onKeyDown: PropTypes.func,
	onKeyUp: PropTypes.func,
	onInit: PropTypes.func
}

export default Sampler
