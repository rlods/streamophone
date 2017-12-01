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

export const fmtMSS = s => (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s

// ------------------------------------------------------------------

export const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

export class Sleeper
{
	constructor() {
		this._resolve = null
		this._timer = null
	}

	sleep(delay) {
		if (!this._timer) {
			return new Promise(resolve => {
				this._resolve = resolve
				this._timer = setTimeout(() => {
					this._timer = null
					this._resolve()
				}, delay)
			})
		}
	}

	stop() {
		if (this._timer) {
			clearTimeout(this._timer)
			this._timer = null
			this._resolve()
		}
	}
}

// ------------------------------------------------------------------

export const chunkArray = (array, size) => {
	const results = []
	for (let i = 0, j = array.length; i < j; i += size)
		results.push(array.slice(i, i + size))
	return results
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
