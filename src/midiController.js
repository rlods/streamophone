import {startSample, stopSample, setSampleVolume} from './actions/sampling'

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

		var ch = data[0]
		var key = data[1]
		var vel = data[2]

		if (ch===176 && key>=1 && key<=8) {
			// change volume of key-1
			console.log("Change volume of ", key-1, " to ", vel/127)
			this.dispatch(setSampleVolume(key-1, vel/127))
		} else {
			// start one sample
			var val = ch + "-" + key
			var sample = -1
			switch(val) {
				case "176-0":
					sample=0
					break;
				case "177-6":
					sample=1
					break;
				case "178-6":
					sample=2
					break;
				case "179-6":
					sample=3
					break;
				case "176-77":
					sample=4
					break;
				case "176-78":
					sample=5
					break;
				case "176-79":
					sample=6
					break;
				case "176-80":
					sample=7
					break;
				default:
					sample=-1
					break
			}
			if (sample!==-1) {
				if (vel===0) {
					console.log("stop sample ", sample)
					this.dispatch(stopSample(sample))
				} else if (vel===127) {
					console.log("start sample ", sample)
					this.dispatch(startSample(sample))
				}
			}
		}
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}

}
