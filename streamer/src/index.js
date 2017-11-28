import 'babel-polyfill'
import cors from 'cors'
import express from 'express'
//
import config from './config'
import { initRoutes } from './controllers/'

// ------------------------------------------------------------------

console.log('CONFIG', config)

const createApp = () => {
	const app = express()
	app.use(cors({
		// credentials: true,
		origin: function (origin, callback) {
			if (config.WHITELIST.indexOf(origin) !== -1)
				callback(null, true)
			else
				callback(new Error('Not allowed by CORS')) // TODO: do not throw, provide some error instead
		}
	}))

	/*
	if (config.CACHE) {
		console.log('Initializing cache')
		initCache()
		console.log('Cache initialized')
	}
	*/

	console.log('Initializing routes')
	initRoutes(app)
	console.log('Routes initialized')

	app.listen(config.STREAMER.PORT)
	app.emit('appReady') // for tests
	console.log(`Listening on ${config.STREAMER.PORT}`)

	return app
}

const app = createApp()
export default app // for tests
