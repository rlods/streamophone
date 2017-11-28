import request from 'request' // TODO: remove is not used anymore

// ------------------------------------------------------------------

export function initRoutes(app) {
	console.log('Registering routers')

	app.use('/:providerId/:resourceId', (req, res) => {
		const { providerId, resourceId } = req.params
		const url = `http://fresques.ina.fr/jalons/media/video/lire/${resourceId}`
		try {
			req.pipe(request(url)).pipe(res)
		}
		catch (error) {
			console.log('PIPE ERROR', error)
		}
	})
}

