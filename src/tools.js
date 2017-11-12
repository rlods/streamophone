
export const chunkArray = (array, size) => {
	const results = []
	for (let i = 0, j = array.length; i < j; i += size)
		results.push(array.slice(i, i + size))
	return results
}

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
