import { startSample, stopSample, setSampleVolume } from '../actions/sampling'
import MidiStrategy from './midiStrategy'

export default class MidiController extends MidiStrategy {
	handleMessage(dispatch, channel, key, velocity) {
		if (channel===176 && key>=1 && key<=8) {
			// change volume of key-1
			console.log("Change volume of ", key-1, " to ", velocity/127)
			dispatch(setSampleVolume(key-1, velocity/127))
		}
		else {
			// start one sample
			var val = channel + "-" + key
			var sample = -1
			switch (val)
			{
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
				if (velocity === 0) {
					console.log("stop sample ", sample)
					dispatch(stopSample(sample))
				} else if (velocity === 127) {
					console.log("start sample ", sample)
					dispatch(startSample(sample))
				}
			}
		}
	}
}
