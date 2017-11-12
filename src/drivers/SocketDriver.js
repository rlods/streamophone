import io from 'socket.io-client'
//
import Driver from './Driver'

// --------------------------------------------------------------

export default class SocketDriver extends Driver {
	constructor(url, prefix) {
		super()
		this.prefix = prefix
		this.url = url
		this.ws = null
		this.init()
	}

	init() {
		this.ws = io(this.url)
		this.ws.on(this.prefix, this.onMessage.bind(this))
	}

	onMessage(message) {
		if (this.strategy)
			this.strategy.handleWebSocket(this.dispatch, message)
	}
}
