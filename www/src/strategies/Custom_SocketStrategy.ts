import Strategy from './Strategy'

// --------------------------------------------------------------

interface SocketMessage {
	id: string
	type: string
	x: number
	y: number
}

// --------------------------------------------------------------

export default class Custom_SocketStrategy extends Strategy {
	private slidersCount: number = 5
	private currentSamplesIndexes: number[] = []

	constructor() {
		super()
		this.slidersCount = 5
		this.samplesCount = 25
		this.currentSamplesIndexes = []
		for (let i = 0; i < this.samplesCount; ++i)
			this.currentSamplesIndexes.push(0)
	}

	handleSocketMessage(message: unknown): void {
		const { id, type, y: originalY } = message as SocketMessage
		if (type === 'position') {
			const y = Math.floor((originalY * 10 + 10) / 2)
			console.log(id, y)
			const base =
				id === 'pouce' ? 0 :
				id === 'index' ? 10 :
				id === 'majeur' ? 20 :
				id === 'annulaire' ? 30 :
				40
			const sampleIndex = base + y
			// TODO : dispatch(stopSample(this.currentSamplesIndexes[index]))
			this._dispatch!({ type: 'SAMPLER_START_SAMPLE', data: { sampleIndex } })
		}
	}
}
