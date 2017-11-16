import { AzertyKeyboard_BasicStrategy, QwertyKeyboard_BasicStrategy } from './Keyboard_BasicStrategy'
import Buttons_MidiStrategy from './Buttons_MidiStrategy'
import Custom_SocketStrategy from './Custom_SocketStrategy'
import Keyboard_MidiStrategy from './Keyboard_MidiStrategy'
import KORG_NanoKey2_MidiStrategy from './KORG_NanoKey2_MidiStrategy'
import LightPadBlock_MidiStrategy from './LightPadBlock_MidiStrategy'
import MultiSliders_MidiStrategy from './MultiSliders_MidiStrategy'
import SingleSlider_MidiStrategy from './SingleSlider_MidiStrategy'

// ------------------------------------------------------------------

export const createStrategy = strategyId => {
	switch (strategyId)
	{
	case 'BCF2000_BUTTONS':        return new Buttons_MidiStrategy()
	case 'BCF2000_MULTISLIDERS':   return new MultiSliders_MidiStrategy(8, 128)
	case 'BCF2000_SINGLESLIDER':   return new SingleSlider_MidiStrategy()
	case 'CUSTOM_SOCKET_STRATEGY': return new Custom_SocketStrategy()
	case 'KEYBOARD_24':            return new Keyboard_MidiStrategy()
	case 'KEYBOARD_AZERTY':        return new AzertyKeyboard_BasicStrategy()
	case 'KEYBOARD_QWERTY':        return new QwertyKeyboard_BasicStrategy()
	case 'KORG_NANOKEY2':          return new KORG_NanoKey2_MidiStrategy()
	case 'LIGHTPADBLOCK_16':       return new LightPadBlock_MidiStrategy()
	default: throw new Error(`Unknown strategy "${strategyId}"`)
	}
}
