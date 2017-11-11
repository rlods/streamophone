import jsonp from 'jsonp'

// ------------------------------------------------------------------

const API_BASE_URL = 'https://api.deezer.com/'

export const chunkArray = (array, size, cb) => {
	const results = []
	for (let i = 0, j = array.length; i < j; i += size)
		results.push(cb(array.slice(i, i + size)))
	return results
}

export const fetchDeezerAPI = url => new Promise((resolve, reject) => {
	jsonp(API_BASE_URL + url + '?output=jsonp&strict=on', null, (err, data) => {
		resolve(data)
	})
})

export const shuffleArray = (arr, size, validateItem) => {
	const copy = arr.slice(0), res = []
	let index, item
	while (size > 0 && copy.length > 0) {
		index = Math.floor(copy.length * Math.random())
		item = copy.splice(index, 1)[0]
		if (validateItem(item)) {
			res.push(item)
			size--
		}
		else {
			// console.log('Skipping', index, copy.length)
		}
	}
	return res
}
