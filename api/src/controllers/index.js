import bodyParser from 'body-parser'
//
import { createProvider } from '../providers'
import { transformArray } from '../helpers'

// ------------------------------------------------------------------

const BODY_PARSER_MIDDLEWARE = bodyParser.json()

// ------------------------------------------------------------------

async function handleTracks(req, res) { // TODO: cache
	try {
		const { providerId, resourceType, resourceId } = req.params
		const { count, transformation } = req.query
		const provider = createProvider(providerId)
		const tracks = await provider.fetchTracks(resourceType, resourceId)
		if (tracks.length > 0) {
			if (tracks.length > count) {
				tracks.splice(count)
			}
			else if (tracks.length < count) {
				for (let i = 0; tracks.length < count; ++i) {
					tracks.push(tracks[i])
				}
			}
		}
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
