import { BaseStore } from './base.mjs'

class MemoryStore extends BaseStore {
  constructor (options) {
    super('memory', options)
    this._cache= {}
  }

  async getKeys(pattern) {
    const keys = Object.keys(this._cache).map(k => this.stripVKey(k))
    if ((! pattern) || (pattern == '*')) {
      return keys
    }
    try {
      
      const regex = new RegExp(pattern)
      return keys.filter(({k}) => k.match(regex))

    } catch(error) {
      this.logError(`getKeys() Error. Pattern argument (${pattern}) must be compatible with <new RegExp(pattern)>. ${error} `)
    }
  }

  async hasItem(key) {
    const exists = Object.prototype.hasOwnProperty.call(this._cache, this.makeVkey(key))
    return exists
  }

  async setItem(key, value, ttl= undefined) {
    const self = this
    
    const vkey = this.makeVkey(key)
    self._cache[vkey]= value

    const rttl = this.getTTL(ttl)
    
    if (rttl) {
      setTimeout(() => {
        self.logDebug(`Expiring ${key} after ${rttl} ms`)
        self.unsetItem(key)
      }, rttl)
    }

    return true
  }

  async getItem(key) {
    const vkey = this.makeVkey(key)
    return this._cache[vkey]
  }

  async unsetItem(key) {
    const exists = await this.hasItem(key)
    if (!exists) {
      return false
    }
    
    const vkey = this.makeVkey(key)
    delete this._cache[vkey]
    return true
  }

}


export async function cacheiroMemoryStoreInit(options) {
  const cache = new MemoryStore(options)

  // Unneeded
  // if (options?.clean) {
  //   await cache.unsetAll()
  // }

  return cache
}