import bodyParser from 'body-parser'
//
import { getProvider } from '../providers'
import { transformArray } from '../helpers'
import { getCache } from '../helpers/cache'

// ------------------------------------------------------------------

const BODY_PARSER_MIDDLEWARE = bodyParser.json()

// ------------------------------------------------------------------

async function handleTracks(req, res) {
	try {
		const { providerId, resourceType, resourceId } = req.params
		const { count, transformation } = req.query
		const provider = await getProvider(providerId)
		if (!provider)
			throw new Error(`Provider "${providerId}" is not supported`)

		const cache = getCache()
		const cacheKey = `TRACKS-${providerId}-${resourceType}-${resourceId}`
		let tracks = cache ? await cache.get(cacheKey) : null
		if (null !== tracks) {
			tracks = JSON.parse(tracks)
		}
		else {
			tracks = await provider.fetchTracks(resourceType, resourceId)
			if (cache)
				cache.set(cacheKey, JSON.stringify(tracks), 'EX', provider.tracksCacheExpiration)
		}

		if (count > 0 && tracks.length > 0 && tracks.length !== count) {
			if (tracks.length > count) {
				tracks.splice(count)
			}
			else {
				for (let i = 0; tracks.length < count; ++i)
					tracks.push(tracks[i])
			}
		}
		if (transformation)
			transformArray(tracks, transformation)

		res.status(200).json(tracks)
	}
	catch (error) {
		res.status(400).json({ message: error.message })
	}
}

// ------------------------------------------------------------------

export function initRoutes(app) {
	console.log('Registering routers')
	app.get('/tracks/:providerId/:resourceType/:resourceId', BODY_PARSER_MIDDLEWARE, handleTracks)
}

