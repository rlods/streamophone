import io from 'socket.io-client'

// --------------------------------------------------------------

export default class SocketController {
	constructor(url, prefix) {
		this.dispatch = null
		this.prefix = prefix
		this.strategy = null
		this.url = url
		this.ws = null
		this.init()
	}

	init() {
		this.ws = io(this.url)
		this.ws.on(this.prefix, this.onMessage.bind(this))
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}

	onMessage(message) {
		if (this.strategy)
			this.strategy.handleWebSocket(this.dispatch, message)
	}
}
