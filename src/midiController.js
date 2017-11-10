import {startSample, stopSample} from './actions/sampling'

export default class MidiController {
	constructor() {
		this.dispatch = null
		this.ready = false
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
				this.ready = true
			}, (error) => {
		    		console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
				reject()
			});
		})
	}

	onMIDIMessage(message) {
		const data = message.data; // this gives us our [command/channel, note, velocity] data.
		console.log('MIDI data', data); // MIDI data [144, 63, 73]
		// use channel for now
		var ch = data[0];

		if (data[2]==127) {
			this.dispatch(startSample(data[0]))
		} else {
			this.dispatch(stopSample(data[0]))
		}
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}

}