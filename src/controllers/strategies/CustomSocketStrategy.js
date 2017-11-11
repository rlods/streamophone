import { startSample } from '../../actions/sampling'
import { Strategy } from './'

// --------------------------------------------------------------

export default class CustomSocketStrategy extends Strategy {
	constructor(samplesCount) {
		super()
		this.slidersCount = 5
		this.samplesCount = 5
		this.currentSamplesIndexes = []
		for (let i = 0; i < this.samplesCount; ++i)
			this.currentSamplesIndexes.push(0)
	}

	handleWebSocket(dispatch, { id, type, x, y }) {
		if (type === 'position') {
			y = Math.floor((y * 10 + 10) / 2)
			console.log(id, y)
			const base =
				id === 'pouce' ? 0 :
				id === 'index' ? 10 :
				id === 'majeur' ? 20 :
				id === 'annulaire' ? 30 :
				40
			const sampleIndex = base + y
			// TODO : dispatch(stopSample(this.currentSamplesIndexes[index]))
			dispatch(startSample(sampleIndex))
		}
	}
}
