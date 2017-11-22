import Redis from 'ioredis'
//
import config from '../config'

// ------------------------------------------------------------------

let CACHE = null

// ------------------------------------------------------------------

export function getCache() {
	return CACHE
}

// ------------------------------------------------------------------

export function initCache() {
	console.log('Creating cache connection...')
	CACHE = new Redis({
		host: config.CACHE.HOST,
		port: config.CACHE.PORT,
		password: config.CACHE.PASSWORD
	})
}

// ------------------------------------------------------------------
