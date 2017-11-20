
export default class Strategy {
	constructor() {
		this._dispatch = null
		this.samplesCount = 0
	}

	attachDispatcher(dispatch) {
		this._dispatch = dispatch
	}

	handleKeyDown(keyCode) {
	}

	handleKeyUp(keyCode) {
	}

	handleMidiEvent(channel, key, velocity) {
	}

	handleSocketMessage(message) {
	}
}
