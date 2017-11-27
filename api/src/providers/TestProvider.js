import Provider from './Provider'
import config from '../config'

// ------------------------------------------------------------------

export default class TestProvider extends Provider
{
	async fetchTracks(sourceType, sourceId) {
		let tracks
		switch (sourceType)
		{
			case 'TEST':
			{
				tracks = [
					{
						cover: config.FAKE.URL + '/fake/fake1.jpg',
						id: 'fake1',
						preview: config.FAKE.URL + '/fake/fake1.mp3',
						readable: true,
						title: 'Fake1',
						url: '#'
					},
					{
						cover: config.FAKE.URL + '/fake/fake2.jpg',
						id: 'fake2',
						preview: config.FAKE.URL + '/fake/fake2.mp3',
						readable: true,
						title: 'Fake2',
						url: '#'
					},
					{
						cover: config.FAKE.URL + '/fake/fake3.jpg',
						id: 'fake3',
						preview: config.FAKE.URL + '/fake/fake3.mp3',
						readable: true,
						title: 'Fake3',
						url: '#'
					}
				]
				break
			}
			default:
			{
				throw new Error(`Unknown test source type "${sourceType}"`)
			}
		}
		return tracks
	}
}
