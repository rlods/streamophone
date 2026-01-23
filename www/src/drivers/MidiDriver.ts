import Driver from './Driver'

// --------------------------------------------------------------

// Extend Navigator interface for Web MIDI API
declare global {
	interface Navigator {
		requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>
	}
}

// Web MIDI API types
declare namespace WebMidi {
	interface MIDIOptions {
		sysex?: boolean
	}

	interface MIDIAccess {
		inputs: MIDIInputMap
		outputs: MIDIOutputMap
		onstatechange: ((event: MIDIConnectionEvent) => void) | null
		sysexEnabled: boolean
	}

	interface MIDIInputMap {
		values(): IterableIterator<MIDIInput>
	}

	interface MIDIOutputMap {
		values(): IterableIterator<MIDIOutput>
	}

	interface MIDIInput extends MIDIPort {
		onmidimessage: ((event: MIDIMessageEvent) => void) | null
	}

	interface MIDIOutput extends MIDIPort {
		send(data: number[] | Uint8Array, timestamp?: number): void
		clear(): void
	}

	interface MIDIPort {
		id: string
		manufacturer?: string
		name?: string
		type: 'input' | 'output'
		version?: string
		state: 'disconnected' | 'connected'
		connection: 'open' | 'closed' | 'pending'
	}

	interface MIDIMessageEvent extends Event {
		data: Uint8Array
	}

	interface MIDIConnectionEvent extends Event {
		port: MIDIPort
	}
}

// --------------------------------------------------------------

export default class MidiDriver extends Driver {
	private inputs: IterableIterator<WebMidi.MIDIInput> | null = null

	constructor() {
		super('midi')
		this.inputs = null
		this.init()
	}

	async init(): Promise<void> {
		try {
			if (!navigator.requestMIDIAccess) {
				console.log("No MIDI support in your browser.")
				throw new Error("No MIDI support in your browser.")
			}

			const midiAccess = await navigator.requestMIDIAccess({ sysex: false })
			console.log("MIDI success")

			this.inputs = midiAccess.inputs.values()
			for (const input of this.inputs) {
				console.log(`Detected input "${input.name?.trim()}"`) // -> 'Lightpad BLOCK'
				input.onmidimessage = this.onMessage.bind(this)
			}
		}
		catch (error) {
			console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim ", error)
		}
	}

	onMessage(message: WebMidi.MIDIMessageEvent): void {
		const data = message.data
		this._callbacks?.onMidiEvent(data[0], data[1], data[2])
	}
}
