import BasicDriver from './BasicDriver'
import MidiDriver from './MidiDriver'
import SocketDriver from './SocketDriver'
import Driver from './Driver'
import config from '../config'

// ------------------------------------------------------------------

export interface DriverDefinition {
	type: 'basic' | 'midi' | 'socket'
	socketUrl?: string
	socketPrefix?: string
}

// ------------------------------------------------------------------

const createDriver = (driverDefinition: DriverDefinition): Driver => {
	switch (driverDefinition.type)
	{
	case 'basic':
		return new BasicDriver()
	case 'midi':
		return new MidiDriver()
	case 'socket':
		return new SocketDriver(driverDefinition.socketUrl!, driverDefinition.socketPrefix!)
	default:
		throw new Error(`Unknown driver type "${(driverDefinition as DriverDefinition).type}"`)
	}
}

// ------------------------------------------------------------------

export const createDrivers = (): Record<string, Driver> => {
	const drivers: Record<string, Driver> = {}
	Object.entries(config.DRIVERS).forEach(([driverId, driverDefinition]) => {
		try {
			drivers[driverId] = createDriver(driverDefinition as DriverDefinition)
		}
		catch (error) {
			console.log(`Cannot create driver "${driverDefinition.type}"`, error)
		}
	})
	return drivers
}
