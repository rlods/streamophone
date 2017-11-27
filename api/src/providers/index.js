import DeezerProvider from './DeezerProvider'
import FreesoundProvider from './FreesoundProvider'
import InaProvider from './InaProvider'
import SpotifyProvider from './SpotifyProvider'
import TestProvider from './TestProvider'

// ------------------------------------------------------------------

const PROVIDERS = {}

// ------------------------------------------------------------------

export const getProvider = providerId => {
	let provider = PROVIDERS[providerId]
	if (!provider) {
		switch (providerId)
		{
		case 'DEEZER':
			provider = new DeezerProvider()
			break
		case 'FREESOUND':
			provider = new FreesoundProvider()
			break
		case 'INA':
			provider = new InaProvider()
			break
		case 'SPOTIFY':
			provider = new SpotifyProvider()
			break
		case 'TEST':
			provider = new TestProvider()
			break
		default:
			throw new Error(`Unknown provider "${providerId}"`)
		}
		PROVIDERS[providerId] = provider
	}
	return provider
}
