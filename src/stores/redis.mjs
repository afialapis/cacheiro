import redis from 'redis'
import {red, green} from 'tinguir'
import { BaseStore } from './base.mjs'
import { initLogger } from '../logger/index.mjs'

class RedisStore extends BaseStore {
  constructor (config, client) {
    super('redis', config)
    this.client = client
  }


  async getKeys(pattern= '*') {
    const rkeys = await this.client.keys(this.makeVkey(pattern))
    return rkeys.map(k => this.stripVKey(k))
  }

  async hasItem(key) {
    const vkey = this.makeVkey(key)
    const exists = await this.client.exists(vkey)
    return exists==1
  }

  async setItem(key, value, expirationTime= undefined) {
    const vkey = this.makeVkey(key)
    let opts= {}
    if (expirationTime) {
      opts.EX= expirationTime
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
    const vkey = this.makeVkey(key)
    const exists = await this.hasItem(vkey)
    if (exists) {
      await this.client.del(vkey)
    }
  }


}



export async function cacheiro_redis_store_init(config) {
  const logger = initLogger(config?.log)
  const client= await redis.createClient(config.redis)
    .on('connect', function () {
      logger.debug(`[cacheiro:redis][v${config?.version||1}] ${green('Connection established!')}`)
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
      logger.error(`[cacheiro:redis][v${config?.version||1}] ${red(msg)}`)
    })
  .connect()

  const cache = new RedisStore(config, client)

  return cache
}
