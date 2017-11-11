import {startSample, stopSample, setSampleVolume} from './actions/sampling'

export default class MidiControllerSlides {
	constructor() {
		this.dispatch = null
		this.ready = false
		this.initMIDI()
		this.currentSample = 0
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

		var ch = data[0]
		var key = data[1]
		var vel = data[2]

		if (ch===176 && key>=1 && key<=8) {
			// change sample
			console.log("Start sample ", vel)
			this.dispatch(stopSample(this.currentSample))
			this.dispatch(startSample(vel))
			this.currentSample = vel
		}
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}

}
