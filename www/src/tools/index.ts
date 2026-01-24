export const KEY_ORDER_AZERTY: string = 'azertyuiopqsdfghjklmwxcvbn'
export const KEY_ORDER_QWERTY: string = 'qwertyuiopasdfghjklzxcvbnm'

// ------------------------------------------------------------------

// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa

type Base64Char = '+' | '/' | '='
type UrlSafeChar = '-' | '_' | '.'

const STR_TO_BASE64_MAPPING: Record<Base64Char, UrlSafeChar> = { '+': '-', '/': '_', '=': '.' }
const BASE64_TO_STR_MAPPING: Record<UrlSafeChar, Base64Char> = { '-': '+', '_': '/', '.': '=' }

export const utoa = (str: string): string => btoa(unescape(encodeURIComponent(str)))
export const atou = (str: string): string => decodeURIComponent(escape(atob(str)))

export const str_to_b64 = (str: string): string =>
	utoa(str).replace(/[+/=]/g, (match) => STR_TO_BASE64_MAPPING[match as Base64Char])
export const b64_to_str = (b64: string): string =>
	atou(b64.replace(/[-_.]/g, (match) => BASE64_TO_STR_MAPPING[match as UrlSafeChar]))

export const js_to_b64 = (js: unknown): string => str_to_b64(JSON.stringify(js))
export const b64_to_js = <T = unknown>(b64: string): T => JSON.parse(b64_to_str(b64)) as T

// ------------------------------------------------------------------

export const fmtMSS = (s: number): string => {
	let seconds = s
	const minutes = Math.floor(seconds / 60)
	seconds = seconds % 60
	return minutes + (9 < seconds ? ':' : ':0') + seconds
}

// ------------------------------------------------------------------

export const sleep = (delay: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, delay))

export class Sleeper {
	private _resolve: (() => void) | null = null
	private _timer: ReturnType<typeof setTimeout> | null = null

	sleep(delay: number): Promise<void> | undefined {
		if (!this._timer) {
			return new Promise((resolve) => {
				this._resolve = resolve
				this._timer = setTimeout(() => {
					this._timer = null
					this._resolve?.()
				}, delay)
			})
		}
		return undefined
	}

	stop(): void {
		if (this._timer) {
			clearTimeout(this._timer)
			this._timer = null
			this._resolve?.()
		}
	}
}

// ------------------------------------------------------------------

export const chunkArray = <T>(array: T[], size: number): T[][] => {
	const results: T[][] = []
	for (let i = 0, j = array.length; i < j; i += size) {
		results.push(array.slice(i, i + size))
	}
	return results
}

// ------------------------------------------------------------------

const HASH_PARAMS: string = document.location.hash.slice(1)

// With BrowserRoute:
// const SEARCH_PARAMS = document.location.search.slice(1)
// With HashRoute:
const SEARCH_PARAMS: string = document.location.hash.slice(
	document.location.hash.indexOf('?') + 1
)

export const getHashParam = (name: string): string | null => {
	const regex = new RegExp(name.replace(/[[]]/g, '\\$&') + '(=([^&#]*)|&|#|$)')
	const results = regex.exec(HASH_PARAMS)
	if (!results) return null
	if (!results[2]) return ''
	return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export const getSearchParam = (name: string): string | null => {
	const regex = new RegExp(name.replace(/[[]]/g, '\\$&') + '(=([^&#]*)|&|#|$)')
	const results = regex.exec(SEARCH_PARAMS)
	if (!results) return null
	if (!results[2]) return ''
	return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
