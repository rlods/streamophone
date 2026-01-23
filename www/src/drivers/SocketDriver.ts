import io, { Socket } from 'socket.io-client'
//
import Driver from './Driver'

// --------------------------------------------------------------

export default class SocketDriver extends Driver {
	private prefix: string
	private url: string
	private ws: Socket

	constructor(url: string, prefix: string) {
		super('socket')
		this.prefix = prefix
		this.url = url
		this.ws = io(this.url)
		this.ws.on(this.prefix, this.onMessage.bind(this))
	}

	onMessage(message: unknown): void {
		this.dispatch!({ type: 'SAMPLER_HANDLE_SOCKET_EVENT', data: { message } })
	}
}
