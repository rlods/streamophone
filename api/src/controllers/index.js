import bodyParser from 'body-parser'
//
import config from '../config'
import { createProvider } from '../providers'

// ------------------------------------------------------------------

const BODY_PARSER_MIDDLEWARE = bodyParser.json()

// ------------------------------------------------------------------

async function handleTracks(req, res) {
	try {
		const { providerId, resourceType, resourceId } = req.params
		const provider = createProvider(providerId)
		const tracks = await provider.fetchTracks(resourceType, resourceId)
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
