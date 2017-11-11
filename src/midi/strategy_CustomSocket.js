import Strategy from './Strategy'

// --------------------------------------------------------------

export default class CustomSocketStrategy extends Strategy {
	handleWebSocket(dispatch, { id, type, x, y }) {
		console.log(id, type, x, y)

		switch (id)
		{
		case 'annulaire':
			break;
		case 'majeur':
			break;
		}
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
