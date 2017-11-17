import Strategy from './Strategy'

// --------------------------------------------------------------

export default class MidiStrategy extends Strategy {
	constructor(intputName) {
		super(intputName)
		this.intputName = intputName // TODO: this is the name given by the device, use it to match with the driver
	}
}
