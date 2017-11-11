
const INITIAL_STATE = {
	curatedPlaylists: [
		{ id: 1083902971, title: 'Hits 2017' },
		{ id: 791313621,  title: 'The Greatest Piano Classics' },
		{ id: 548368765,  title: 'Long Playlist' },
		{ id: 3789105302, title: 'Steve Reich' },
		{ id: 10178447,   title: 'Percus' },
		{ id: 3791846562, title: 'Speeches' },
		{ id: 1194890603, title: 'Best of Daft Punk' },
		{ id: 771276181,  title: 'Musique concrète et électronique' },
		{ id: 3510240466, title: 'Soul to Funk' },
		{ id: 23804156,   title: 'Minimal electro house' }
	]
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type)
	{
	default:
		return state
	}
}