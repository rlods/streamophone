import DeezerProvider from './DeezerProvider'
import FreesoundProvider from './FreesoundProvider'
import InaProvider from './InaProvider'
import SpotifyProvider from './SpotifyProvider'
import TestProvider from './TestProvider'
import Provider from './Provider'
import config from '../config'

// ------------------------------------------------------------------

type ProviderId = 'DEEZER' | 'FREESOUND' | 'INA' | 'SPOTIFY' | 'TEST';

const PROVIDERS: Partial<Record<ProviderId, Provider>> = {}

// ------------------------------------------------------------------

export const getProvider = (providerId: string): Provider | undefined => {
	const id = providerId as ProviderId
	let provider = PROVIDERS[id]
	if (!provider) {
		const providerDef = config.PROVIDERS[id]
		if (providerDef) {
			switch (id)
			{
			case 'DEEZER':
				provider = new DeezerProvider()
				break
			case 'FREESOUND':
				provider = new FreesoundProvider(config.PROVIDERS.FREESOUND)
				break
			case 'INA':
				provider = new InaProvider()
				break
			case 'SPOTIFY':
				provider = new SpotifyProvider(config.PROVIDERS.SPOTIFY)
				break
			case 'TEST':
				provider = new TestProvider()
				break
			default:
				throw new Error(`Unknown provider "${providerId}"`)
			}
			PROVIDERS[id] = provider
		}
	}
	return provider
}
