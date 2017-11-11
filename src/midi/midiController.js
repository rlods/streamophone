
export default class MidiController {
	constructor(strategy) {
		this.dispatch = null
		this.strategy = strategy
		this.initMIDI()
	}

	initMIDI() {
		return new Promise((resolve, reject) => {
			if (!navigator.requestMIDIAccess) {
				console.log("No MIDI support in your browser.")
				reject("No MIDI support in your browser.")
				return
			}

			navigator.requestMIDIAccess({ sysex: false }).then(midiAccess => {
			    console.log("MIDI success");

			    const inputs = midiAccess.inputs.values();
			    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
				input.value.onmidimessage = this.onMIDIMessage.bind(this);
			    }
			}, (error) => {
		    		console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
				reject()
			});
		})
	}

	onMIDIMessage(message) {
		const data = message.data; // this gives us our [command/channel, note, velocity] data.
		console.log('MIDI data', data); // MIDI data [144, 63, 73]
		this.strategy.handleMessage(this.dispatch, data[0], data[1], data[2])
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}

}
