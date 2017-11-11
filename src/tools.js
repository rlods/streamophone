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

export const shuffleArray = (arr, size) => {
	const shuffled = arr.slice(0)
	let i = arr.length, temp, index
	while (i--) {
		index = Math.floor((i + 1) * Math.random())
		temp = shuffled[index]
		shuffled[index] = shuffled[i]
		shuffled[i] = temp
	}
	return shuffled.slice(0, size)
}
