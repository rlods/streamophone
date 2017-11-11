import { setSampleVolume } from '../actions/sampling'
import MidiStrategy from './midiStrategy'

export default class Strategy extends MidiStrategy {
	handleMessage(dispatch, channel, key, velocity) {
		console.log(channel)
		if (channel === 223) {
			console.log('LightPadMessage', channel, key, velocity); // MIDI data [144, 63, 73]
		
		}
		else if (channel === 210) {
			console.log('LightPadMessage', channel, key, velocity); // MIDI data [144, 63, 73]
		
		}
		else if (channel === 211) {
			console.log('LightPadMessage', channel, key, velocity); // MIDI data [144, 63, 73]
		
		}
	}
}
