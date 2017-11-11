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

	onMessage(message) { // TODO: create a specific Strategy
		console.log(message)
		/*
		index.js:34 {id: "majeur", type: "position", x: 0.046966731548309326, y: 0}
		index.js:34 {id: "annulaire", type: "position", x: 0, y: -0.001956947147846222}
		index.js:34 {id: "annulaire", type: "position", x: 0, y: 0}
		index.js:34 {id: "majeur", type: "position", x: 0.045009784400463104, y: 0}
		index.js:34 {id: "annulaire", type: "position", x: 0, y: -0.001956947147846222}
		index.js:34 {id: "majeur", type: "position
		*/
	}
}
