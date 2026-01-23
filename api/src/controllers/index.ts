import bodyParser from 'body-parser'
import type { Application, Request, Response } from 'express'
import { getProvider } from '../providers'
import { transformArray } from '../helpers'
import { getCache } from '../helpers/cache'
import type { Track } from '../providers/Provider'

// ------------------------------------------------------------------

const BODY_PARSER_MIDDLEWARE = bodyParser.json()

// ------------------------------------------------------------------

interface TracksParams {
	providerId: string;
	resourceType: string;
	resourceId: string;
}

interface TracksQuery {
	count?: string;
	transformation?: string;
}

// ------------------------------------------------------------------

async function handleTracks(req: Request<TracksParams, unknown, unknown, TracksQuery>, res: Response): Promise<void> {
	try {
		const { providerId, resourceType, resourceId } = req.params
		const { count, transformation } = req.query
		const provider = await getProvider(providerId)
		if (!provider)
			throw new Error(`Provider "${providerId}" is not supported`)

		const cache = getCache()
		const cacheKey = `TRACKS-${providerId}-${resourceType}-${resourceId}`
		let tracks: Track[] | null = cache ? await cache.get(cacheKey) as unknown as Track[] | null : null
		if (null !== tracks && typeof tracks === 'string') {
			tracks = JSON.parse(tracks) as Track[]
		}
		else if (tracks === null) {
			tracks = await provider.fetchTracks(resourceType, resourceId)
			if (cache)
				cache.set(cacheKey, JSON.stringify(tracks), 'EX', provider.tracksCacheExpiration)
		}

		const countNum = count ? parseInt(count, 10) : 0
		if (countNum > 0 && tracks.length > 0 && tracks.length !== countNum) {
			if (tracks.length > countNum) {
				tracks.splice(countNum)
			}
			else {
				for (let i = 0; tracks.length < countNum; ++i)
					tracks.push(tracks[i])
			}
		}
		if (transformation)
			transformArray(tracks, transformation)

		res.status(200).json(tracks)
	}
	catch (error) {
		const err = error as Error
		res.status(400).json({ message: err.message })
	}
}

// ------------------------------------------------------------------

export function initRoutes(app: Application): void {
	console.log('Registering routers')
	app.get('/tracks/:providerId/:resourceType/:resourceId', BODY_PARSER_MIDDLEWARE, handleTracks as unknown as Parameters<Application['get']>[1])
}
