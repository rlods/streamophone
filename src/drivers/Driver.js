
export default class Driver {
	constructor(type) {
		this.dispatch = null
		this.type = type
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}
}
