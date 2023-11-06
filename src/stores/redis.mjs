import redis from 'redis'
import { red, magenta } from 'tinguir'


import CacheSore from './base.mjs'

class CacheStoreRedis extends CacheSore {
  constructor (config) {
    super(config)
    this.client= redis.createClient(config.port, config.host)
    .on('connect', function () {
      console.info(`${magenta('REDIS')} Connection established!`)
    })
    .on('error', function (err) {
      let msg
      try {
        if (err instanceof redis.ReplyError)
          msg = `${magenta('REDIS')} ${red('Error ' + err.code)} Command: ${err.command} ${err.toString()}`
        else
          msg = `${magenta('REDIS')} ${red('Error ' + err.code)} ${err.toString()}`
      } catch(e) {
        msg = `${magenta('REDIS')} ${red('Error ')} ${e}`
      }
      console.error(msg)
    })
    .connect()

  }

  getKeys() {
    
  }

  hasItem(key) {
    return this.client.exists(key)==1
  }

  setItem(key, value, expirationTime= undefined) {
    let opts= {}
    if (expirationTime) {
      opts.EX= expirationTime
    }
    const r= this.client.set(key, value, opts)
    return r == 'OK' ? true : false    
  }

  getItem(key) {
    return this.client.get(key)
  }

  unsetItem(key) {
    if (this.hasItem(key)) {
      this.client.del(key)
    }
  }
}

export default CacheStoreRedis




