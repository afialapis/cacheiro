import { BaseStore } from './base.mjs'
import { cacheiro_memory_store_init } from './memory.mjs'
import { cacheiro_redis_store_init } from './redis.mjs'

export class CombinedStore extends BaseStore {
  constructor (config, memory, redis) {
    super('combined', config)
    this._memory = memory
    this._redis = redis
  }
  
  // For check operations, trust only Redis

  async getKeys(pattern) {
    return (await this._redis.getKeys(pattern))
  }

  async hasItem(key) {
    return (await this._redis.hasItem(key))
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
      const ex = this._redis.expireTime(key)
      await this._memory.setItem(key, value, ex)
    }
    
    return value
  }
  
  // When updating, just do it twice

  async unsetItem(key) {
    await this._memory.unsetItem(key)
    await this._redis.unsetItem(key)
  }
  
  async setItem(key, value, expirationTime= undefined) {
    const mok = await this._memory.setItem(key, value, expirationTime)
    const rok = await this._redis.setItem(key, value, expirationTime)
    return (mok && rok)
  }

}





export async function cacheiro_combined_store_init(config) {
  const memory = cacheiro_memory_store_init(config)
  const redis = await cacheiro_redis_store_init(config)

  const cache = new CombinedStore(config, memory, redis)
  return cache
}