
export const chunkArray = (array, size) => {
	const results = []
	for (let i = 0, j = array.length; i < j; i += size)
		results.push(array.slice(i, i + size))
	return results
}

export const shuffleArray = (arr, size) => {
	const res = []
	let index, item
	while (size > 0 && arr.length > 0) {
		index = Math.floor(arr.length * Math.random())
		item = arr.splice(index, 1)[0]
		res.push(item)
		size--
	}
	return res
}

export const transformArray = (arr, size, transformationType, validationCB) => {
	const copy = arr.filter(item => validationCB(item))

	// Fill by looping if not enough items
	if (copy.length > 0 && copy.length < size) {
		// console.log('Enrichment', copy.length, size - copy.length)
		for (let i = 0; copy.length < size; ++i) {
			copy.push(copy[i])
		}
	}

	switch (transformationType)
	{
	case 'none':
		return copy.slice(0, size)
	case 'shuffle':
		return shuffleArray(copy, size)
	default:
		throw new Error(`Unknown transformation type "${transformationType}"`)
	}
}
