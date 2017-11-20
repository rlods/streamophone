import DeezerProvider from './DeezerProvider'
import FreesoundProvider from './FreesoundProvider'
import SpotifyProvider from './SpotifyProvider'
import TestProvider from './TestProvider'

// ------------------------------------------------------------------

export const createProvider = providerId => {
	switch (providerId)
	{
	case 'deezer':    return new DeezerProvider()
	case 'freesound': return new FreesoundProvider()
	case 'spotify':   return new SpotifyProvider()
	case 'test':      return new TestProvider()
	default: throw new Error(`Unknown provider "${providerId}"`)
	}
}
