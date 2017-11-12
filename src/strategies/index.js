import KeyboardBasicStrategy from './KeyboardBasicStrategy'
import ButtonsStrategy from './midiStrategy_Buttons'
import CustomSocketStrategy from './CustomSocketStrategy'
import MultiSlidersStrategy from './midiStrategy_MultiSliders'
import SingleSliderStrategy from './midiStrategy_SingleSlider'
import LightPadBlockStrategy from './midiStrategy_LightPadBlock'
import KeyboardStrategy from './midiStrategy_Keyboard'

// ------------------------------------------------------------------

export const createStrategy = strategyId => {
	switch (strategyId)
	{
	case 'KEYBOARD_AZERTY':        return new KeyboardBasicStrategy()
	case 'BCF2000_BUTTONS':        return new ButtonsStrategy()
	case 'BCF2000_SINGLESLIDER':   return new SingleSliderStrategy()
	case 'BCF2000_MULTISLIDERS':   return new MultiSlidersStrategy(8, 128)
	case 'LIGHTPADBLOCK_16':       return new LightPadBlockStrategy()
	case 'CUSTOM_SOCKET_STRATEGY': return new CustomSocketStrategy()
	case 'KEYBOARD_24':            return new KeyboardStrategy()
	default: throw new Error(`Unknown strategy "${strategyId}"`)
	}
}
