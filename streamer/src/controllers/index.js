import request from 'request' // TODO: remove is not used anymore

// ------------------------------------------------------------------

export function initRoutes(app) {
	console.log('Registering routers')

	app.use('/ina/:resourceId', (req, res) => {
		const { resourceId } = req.params
		const url = `http://fresques.ina.fr/jalons/media/video/lire/${resourceId}`
		console.log(url)
		try {
			req.pipe(request(url)).pipe(res)
		}
		catch (error) {
			console.log('PIPE ERROR', error)
		}
	})
}

