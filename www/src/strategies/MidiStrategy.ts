import Strategy from './Strategy'

// --------------------------------------------------------------

export default class MidiStrategy extends Strategy {
	public inputName: string

	constructor(inputName: string) {
		super()
		this.inputName = inputName // TODO: this is the name given by the device, use it to match with the driver
	}
}
