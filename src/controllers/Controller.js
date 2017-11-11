
export default class Controller {
	constructor() {
		this.dispatch = null
		this.strategy = null
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}
}
