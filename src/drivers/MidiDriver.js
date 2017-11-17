import { handleMidiEvent } from '../actions/sampling'
import Driver from './Driver'

// --------------------------------------------------------------

export default class MidiDriver extends Driver {
	constructor() {
		super('midi')
		this.inputs = null
		this.init()
	}

	async init() {
		try {
			if (!navigator.requestMIDIAccess) {
				console.log("No MIDI support in your browser.")
				throw new Error("No MIDI support in your browser.")
			}

			const midiAccess = await navigator.requestMIDIAccess({ sysex: false })
			console.log("MIDI success")
			
			this.inputs = midiAccess.inputs.values()
			for (let input of this.inputs) {
				console.log(`Detected input "${input.name.trim()}"`) // -> 'Lightpad BLOCK'
				input.onmidimessage = this.onMessage.bind(this)
			}
		}
		catch (error) {
			console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim ", error);
		}
	}

	onMessage(message) {
		const data = message.data
		this.dispatch(handleMidiEvent(data[0], data[1], data[2]))
	}
}
