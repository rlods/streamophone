// --------------------------------------------------------------

export type DriverType = 'basic' | 'midi' | 'socket'

export interface DriverCallbacks {
	onMidiEvent: (channel: number, key: number, velocity: number) => void
	onSocketEvent: (message: unknown) => void
}

// --------------------------------------------------------------

export default class Driver {
	protected _callbacks: DriverCallbacks | null = null
	public type: DriverType

	constructor(type: DriverType) {
		this._callbacks = null
		this.type = type
	}

	setCallbacks(callbacks: DriverCallbacks): void {
		this._callbacks = callbacks
	}
}
