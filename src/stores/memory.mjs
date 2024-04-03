import { BaseStore } from './base.mjs'

class MemoryStore extends BaseStore {
  constructor (config) {
    super('memory', config)
    this._cache= {}
  }

  async getKeys(pattern) {
    const keys = Object.keys(this._cache).map(k => this.stripVKey(k))
    if (! pattern) {
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
    return Object.prototype.hasOwnProperty.call(this._cache, this.makeVkey(key))
  }

  async setItem(key, value, expirationTime= undefined) {
    const self = this
    
    const vkey = this.makeVkey(key)
    self._cache[vkey]= value
    
    if (expirationTime) {
      setTimeout(() => {
        self.logDebug(`Expiring ${key} after ${expirationTime} ms`)
        self.unsetItem(vkey)
      }, expirationTime)
    }

    return true
  }

  async getItem(key) {
    const vkey = this.makeVkey(key)
    return this._cache[vkey]
  }

  async unsetItem(key) {
    const vkey = this.makeVkey(key)
    const exists = await this.hasItem(vkey)
    if (exists) {
      delete this._cache[vkey]
    }
  }

}


export function cacheiro_memory_store_init(config) {
  const cache = new MemoryStore(config)
  return cache
}