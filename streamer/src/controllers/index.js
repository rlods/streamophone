import axios from 'axios'

// ------------------------------------------------------------------

export function initRoutes(app) {
	console.log('Registering routers')

	app.use('/ina/:resourceId', async (req, res) => {
		const { resourceId } = req.params
		const url = `http://fresques.ina.fr/jalons/media/video/lire/${resourceId}`
		console.log(url)
		try {
			const response = await axios({
				method: 'get',
				url: url,
				responseType: 'stream'
			})
			response.data.pipe(res)
		}
		catch (error) {
			console.log('PIPE ERROR', error)
			res.status(500).send('Error streaming content')
		}
	})
}
