import redis from 'redis'
import {red, green} from 'tinguir'
import { BaseStore } from './base.mjs'
import { cacheiroInitLogger } from '../logger/index.mjs'

class RedisStore extends BaseStore {
  constructor (options, client) {
    super('redis', options)
    this.client = client
  }


  async getKeys(pattern) {
    const rpatt = this.makeVkey(pattern || '*')
    const rkeys = await this.client.keys(rpatt)
    return rkeys.map(k => this.stripVKey(k))
  }

  async hasItem(key) {
    const vkey = this.makeVkey(key)
    const exists = await this.client.exists(vkey)
    return exists==1
  }

  async setItem(key, value, ttl= undefined) {
    const vkey = this.makeVkey(key)
    let opts= {}

    const rttl = this.getTTL(ttl)
    if (rttl) {
      opts.PX= rttl
    }
    const r= await this.client.set(vkey, value, opts)
    return r == 'OK' ? true : false    
  }

  async getItem(key) {
    const vkey = this.makeVkey(key)
    const value = await this.client.get(vkey)
    return value
  }

  async expireTime(key) {
    const vkey = this.makeVkey(key)
    const ex = await this.client.expireTime(vkey)
    return ex
  }

  async unsetItem(key) {
    const exists = await this.hasItem(key)
    if (!exists) {
      return false
    }
    
    const vkey = this.makeVkey(key)
    await this.client.del(vkey)
    return true
  }

}



export async function cacheiroRedisStoreInit(options) {
  const logger = cacheiroInitLogger(options?.log)
  const client= await redis.createClient(options.redis)
    .on('connect', function () {
      logger.debug(`[cacheiro:redis][v${options?.version||1}] ${green('Connection established!')}`)
    })
    .on('error', function (err) {
      let msg
      try {
        if (err instanceof redis.ReplyError)
          msg = `Error ${err.code}. Command: ${err.command} ${err.toString()}`
        else
          msg = `Error ${err.code}. ${err.toString()}`
      } catch(e) {
        msg = `Error ${e}`
      }
      logger.error(`[cacheiro:redis][v${options?.version||1}] ${red(msg)}`)
    })
  .connect()

  const cache = new RedisStore(options, client)

  if (options?.clean) {
    await cache.unsetAll()
  }

  return cache
}
