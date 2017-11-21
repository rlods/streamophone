import io from 'socket.io-client'
//
import Driver from './Driver'
import { handleSocketEvent } from '../actions/sampler'

// --------------------------------------------------------------

export default class SocketDriver extends Driver {
	constructor(url, prefix) {
		super('socket')
		this.prefix = prefix
		this.url = url
		this.ws = io(this.url)
		this.ws.on(this.prefix, this.onMessage.bind(this))
	}

	onMessage(message) {
		this.dispatch(handleSocketEvent(message))
	}
}
