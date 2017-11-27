import 'babel-polyfill'
import cors from 'cors'
import express from 'express'
//
import config from './config'
import { initCache } from './helpers/cache'
import { initRoutes } from './controllers/'

// ------------------------------------------------------------------

console.log('CONFIG', config)

const createApp = () => {
	const app = express()
	app.use(cors({
		// credentials: true,
		origin: config.WWW.URL
	}))

	// console.log('Initializing cache')
	// initCache()
	// console.log('Cache initialized')

	if (config.CACHE) {
		console.log('Initializing cache')
		initCache()
		console.log('Cache initialized')
	}

	console.log('Initializing authentication')
	initRoutes(app)
	console.log('Authentication initialized')

	app.listen(config.API.PORT)
	app.emit('appReady') // for tests
	console.log(`Listening on ${config.API.PORT}`)

	return app
}

const app = createApp()
export default app // for tests
