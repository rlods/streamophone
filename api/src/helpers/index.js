
export const shuffleArray = arr => {
	let i = 0, j = 0, tmp = null
	for (i = arr.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1))
		tmp = arr[i]
		arr[i] = arr[j]
		arr[j] = tmp
	}
}

export const transformArray = (arr, transformation) => {
	if (transformation) {
		switch (transformation)
		{
		case 'none':
			break
		case 'shuffle':
			shuffleArray(arr)
			break
		default:
			console.log(`Unknown transformation "${transformation}"`)
			break
		}
	}
}
