import Redis from "ioredis";
// import config from '../config'

// ------------------------------------------------------------------

let CACHE: Redis | null = null;

// ------------------------------------------------------------------

export function getCache(): Redis | null {
  return CACHE;
}

// ------------------------------------------------------------------

export function initCache(): void {
  console.log("Creating cache connection...");
  // TODO: RE-ENABLE REDIS CACHE
  // CACHE = new Redis({
  // 	host: config.CACHE.HOST,
  // 	port: config.CACHE.PORT,
  // 	password: config.CACHE.PASSWORD
  // })
}

// ------------------------------------------------------------------
