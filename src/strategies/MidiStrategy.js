import Strategy from './Strategy'

// --------------------------------------------------------------

export default class MidiStrategy extends Strategy {
	constructor(intputName) {
		super(intputName)
		this.intputName = intputName
	}
}
