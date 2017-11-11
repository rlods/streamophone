import Strategy from './Strategy'

// --------------------------------------------------------------

export default class CustomSocketStrategy extends Strategy {
	handleWebSocket(dispatch, message) { // TODO: create a specific Strategy
		console.log(message)
		/*
		{id: "majeur", type: "position", x: 0.046966731548309326, y: 0}
		{id: "annulaire", type: "position", x: 0, y: -0.001956947147846222}
		{id: "annulaire", type: "position", x: 0, y: 0}
		{id: "majeur", type: "position", x: 0.045009784400463104, y: 0}
		{id: "annulaire", type: "position", x: 0, y: -0.001956947147846222}
		{id: "majeur", type: "position
		*/
	}
}
