
export default class Driver {
	constructor() {
		this.dispatch = null
		this.strategy = null
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}
}
