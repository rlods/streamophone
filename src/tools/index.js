export const KEY_ORDER_AZERTY   = 'azertyuiopqsdfghjklmwxcvbn'
export const KEY_ORDER_QWERTY   = 'qwertyuiopasdfghjklzxcvbnm'

// ------------------------------------------------------------------

// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa

const STR_TO_BASE64_MAPPING = { '+':'-', '/':'_', '=':'.' }
const BASE64_TO_STR_MAPPING = { '-':'+', '_':'/', '.':'=' }

export const utoa = str => btoa(unescape(encodeURIComponent(str)))
export const atou = str => decodeURIComponent(escape(atob(str)))

export const str_to_b64 = str => utoa(str).replace(/[+/=]/g, match => STR_TO_BASE64_MAPPING[match])
export const b64_to_str = b64 => atou(b64.replace(/[-_.]/g, match => BASE64_TO_STR_MAPPING[match]))

export const js_to_b64 = js  => str_to_b64(JSON.stringify(js))
export const b64_to_js = b64 => JSON.parse(b64_to_str(b64))

// ------------------------------------------------------------------

export const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

// ------------------------------------------------------------------

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

export const transformArray = (arr, size, transformation, validationCB) => {
	const copy = arr.filter(item => validationCB(item))

	// Fill by looping if not enough items
	if (copy.length > 0 && copy.length < size) {
		// console.log('Enrichment', copy.length, size - copy.length)
		for (let i = 0; copy.length < size; ++i) {
			copy.push(copy[i])
		}
	}

	switch (transformation)
	{
	case 'none':
		return copy.slice(0, size)
	case 'shuffle':
		return shuffleArray(copy, size)
	default:
		throw new Error(`Unknown transformation "${transformation}"`)
	}
}

// ------------------------------------------------------------------

const HASH_PARAMS = document.location.hash.slice(1)

// With BrowserRoute:
// const SEARCH_PARAMS = document.location.search.slice(1)
// With HashRoute:
const SEARCH_PARAMS = document.location.hash.slice(document.location.hash.indexOf('?')+1)

export const getHashParam = name => {
	const regex = new RegExp(name.replace(/[[]]/g, "\\$&") + "(=([^&#]*)|&|#|$)")
	const results = regex.exec(HASH_PARAMS)
	if (!results) return null
	if (!results[2]) return ''
	return decodeURIComponent(results[2].replace(/\+/g, " "))
}

export const getSearchParam = name => {
	const regex = new RegExp(name.replace(/[[]]/g, "\\$&") + "(=([^&#]*)|&|#|$)")
	const results = regex.exec(SEARCH_PARAMS)
	if (!results) return null
	if (!results[2]) return ''
	return decodeURIComponent(results[2].replace(/\+/g, " "))
}
