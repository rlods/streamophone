import DeezerProvider from './DeezerProvider'
import FreesoundProvider from './FreesoundProvider'
import SpotifyProvider from './SpotifyProvider'

// ------------------------------------------------------------------

export const createProvider = providerId => {
	switch (providerId)
	{
	case 'deezer':    return new DeezerProvider()
	case 'freesound': return new FreesoundProvider()
	case 'spotify':   return new SpotifyProvider()
	default: throw new Error(`Unknown provider "${providerId}"`)
	}
}
