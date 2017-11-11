import {startSample, stopSample, setSampleVolume} from './actions/sampling'

export default class MidiControllerMultilides {
	constructor() {
		this.slidersCount = 8 // TODO: configurable
		this.slidersSteps = 128 // TODO: configurable
		this.dispatch = null
		this.ready = false
		this.initMIDI()
		this.currentSamples = []
		for (let i = 0; i < this.slidersCount; ++i)
			this.currentSamples.push(0)
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

		const channel = data[0]
		const key = data[1]
		const vel = data[2]
		const sample = (key * 8) - Math.floor(vel * 8 / this.slidersSteps) + (this.slidersCount * (key - 1)) - 1

		if (channel === 176 && key >= 1 && key <= this.slidersCount) {
			const oldSample = this.currentSamples[key-1]
			if (sample !== oldSample) {
				// change sample
				console.log("Start sample ", sample)
				this.dispatch(stopSample(oldSample))
				this.dispatch(startSample(sample))
				this.currentSamples[key-1] = sample
			}
		}
	}

	attach(dispatch) {
		this.dispatch = dispatch
	}

}
