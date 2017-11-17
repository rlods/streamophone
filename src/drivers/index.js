import BasicDriver from './BasicDriver'
import MidiDriver from './MidiDriver'
import SocketDriver from './SocketDriver'
import config from '../config'

// ------------------------------------------------------------------

const createDriver = (driverDefinition) => {
	switch (driverDefinition.type)
	{
	case 'basic':
		return new BasicDriver()
	case 'midi':
		return new MidiDriver()
	case 'socket':
		return new SocketDriver(driverDefinition.socketUrl, driverDefinition.socketPrefix)
	default:
		throw new Error(`Unknown driver type "${driverDefinition.type}"`)
	}
}

// ------------------------------------------------------------------

export const createDrivers = () => {
	const drivers = {}
	Object.entries(config.DRIVERS).forEach(([driverId, driverDefinition]) => {
		try {
			drivers[driverId] = createDriver(driverDefinition)
		}
		catch (error) {
			console.log(`Cannot create driver "${driverDefinition.type}"`, error)
		}
	})
	return drivers
}
