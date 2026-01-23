// --------------------------------------------------------------

export interface StrategyCallbacks {
	onStartSample: (sampleIndex: number) => void
	onStopSample: (sampleIndex: number) => void
	onSampleVolumeChange: (sampleIndex: number, volume: number) => void
}

// --------------------------------------------------------------

export default class Strategy {
	protected _callbacks: StrategyCallbacks | null = null
	public samplesCount: number = 0

	constructor() {
		this._callbacks = null
		this.samplesCount = 0
	}

	setCallbacks(callbacks: StrategyCallbacks): void {
		this._callbacks = callbacks
	}

	handleKeyDown(keyCode: number): void {
		// Override in subclasses
	}

	handleKeyUp(keyCode: number): void {
		// Override in subclasses
	}

	handleMidiEvent(channel: number, key: number, velocity: number): void {
		// Override in subclasses
	}

	handleSocketMessage(message: unknown): void {
		// Override in subclasses
	}
}
