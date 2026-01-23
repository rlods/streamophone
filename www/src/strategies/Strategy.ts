import type { AppDispatch } from '../types'

// --------------------------------------------------------------

export default class Strategy {
	protected _dispatch: AppDispatch | null = null
	public samplesCount: number = 0

	constructor() {
		this._dispatch = null
		this.samplesCount = 0
	}

	attachDispatcher(dispatch: AppDispatch): void {
		this._dispatch = dispatch
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
