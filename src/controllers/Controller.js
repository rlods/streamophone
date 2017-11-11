
export default class Controller {
	constructor(strategy) {
		this.dispatch = null
		this.strategy = strategy
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}
}
