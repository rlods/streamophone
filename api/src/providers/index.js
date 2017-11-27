import DeezerProvider from './DeezerProvider'
import FreesoundProvider from './FreesoundProvider'
import InaProvider from './InaProvider'
import SpotifyProvider from './SpotifyProvider'
import TestProvider from './TestProvider'
import config from '../config'

// ------------------------------------------------------------------

const PROVIDERS = {}

// ------------------------------------------------------------------

export const getProvider = providerId => {
	let provider = PROVIDERS[providerId]
	if (!provider) {
		const providerDef = config.PROVIDERS[providerId]
		if (providerDef) {
			switch (providerId)
			{
			case 'DEEZER':
				provider = new DeezerProvider(providerDef)
				break
			case 'FREESOUND':
				provider = new FreesoundProvider(providerDef)
				break
			case 'INA':
				provider = new InaProvider(providerDef)
				break
			case 'SPOTIFY':
				provider = new SpotifyProvider(providerDef)
				break
			case 'TEST':
				provider = new TestProvider(providerDef)
				break
			default:
				throw new Error(`Unknown provider "${providerId}"`)
			}
			PROVIDERS[providerId] = provider
		}
	}
	return provider
}
