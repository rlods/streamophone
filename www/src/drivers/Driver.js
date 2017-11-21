
export default class Driver {
	constructor(type) {
		this.dispatch = null
		this.type = type
	}

	attachDispatcher(dispatch) {
		this.dispatch = dispatch
	}
}
