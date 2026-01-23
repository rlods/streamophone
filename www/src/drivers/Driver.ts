import type { AppDispatch } from '../types'

// --------------------------------------------------------------

export type DriverType = 'basic' | 'midi' | 'socket'

// --------------------------------------------------------------

export default class Driver {
	public dispatch: AppDispatch | null = null
	public type: DriverType

	constructor(type: DriverType) {
		this.dispatch = null
		this.type = type
	}

	attachDispatcher(dispatch: AppDispatch): void {
		this.dispatch = dispatch
	}
}
