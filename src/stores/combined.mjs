import { BaseStore } from './base.mjs'
import { cacheiroMemoryStoreInit } from './memory.mjs'
import { cacheiroRedisStoreInit } from './redis.mjs'

export class CombinedStore extends BaseStore {
  constructor (options, memory, redis) {
    super('combined', options)
    this._memory = memory
    this._redis = redis
  }
  
  // For check operations, trust only Redis

  async getKeys(pattern) {
    return (await this._redis.getKeys(pattern))
  }

  async hasItem(key) {
    const mhas = await this._memory.hasItem(key)
    if (mhas) {
      return mhas
    }
    const rhas = await this._redis.hasItem(key)
    return rhas
  }

  // When reading, try first memory
  // If not in memory but in Redis, save in memory

  async getItem(key) {
    const inmem = await this._memory.hasItem(key)
    if (inmem) {
      const value = this._memory.getItem(key)
      return value
    }

    const value = await this._redis.getItem(key)

    if (value != undefined) {
      const ex = this._redis.getItemTTL(key)
      await this._memory.setItem(key, value, ex)
    }
    
    return value
  }

  async getItemTTL(key) {
    const inmem = await this._memory.hasItem(key)
    if (inmem) {
      return this._memory.getItemTTL(key)
    }
    return this._redis.getItemTTL(key)
  }

  
  // When updating, just do it twice

  async unsetItem(key) {
    const mexists = await this._memory.unsetItem(key)
    const rexists = await this._redis.unsetItem(key)
    return mexists || rexists
  }

  async unsetAll(pattern) {
    const mlen = await this._memory.unsetAll(pattern)
    const rlen = await this._redis.unsetAll(pattern)
    return mlen + rlen
  }
  
  async setItem(key, value, ttl= undefined) {
    const mok = await this._memory.setItem(key, value, ttl)
    const rok = await this._redis.setItem(key, value, ttl)
    return (mok && rok)
  }

  async close() {
    await this._memory.close()
    await this._redis.close()
  }

}





export async function cacheiroCombinedStoreInit(options) {
  const memory = await cacheiroMemoryStoreInit(options)
  const redis = await cacheiroRedisStoreInit(options)

  const cache = new CombinedStore(options, memory, redis)

  if (options?.clean) {
    await cache.unsetAll('*')
  }

  return cache
}