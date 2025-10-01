import { BaseStore } from './base.mjs'

const MAX_TIMEOUT_TTL = 2147483647

class MemoryStore extends BaseStore {
  constructor (options) {
    super('memory', options)
    this._cache= {}
    this._cleaners= {}
  }

  async getKeys(pattern) {
    const keys = Object.keys(this._cache).map(k => this.getExternalKey(k))
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
    const exists = Object.prototype.hasOwnProperty.call(this._cache, this.getInnerKey(key))
    return exists
  }

  async setItem(key, value, ttl= undefined) {
    const self = this
    
    const vkey = this.getInnerKey(key)
    let rttl = this.getTTL(ttl)
    if (rttl) {
      if (rttl > MAX_TIMEOUT_TTL) {
        self.logWarning(`Memory cache is expired using setTimeout, which has a ttl limit of ${MAX_TIMEOUT_TTL}. A greater value was passed ${rttl} but it will be restricted to the limit.`)
        rttl = MAX_TIMEOUT_TTL     
      }
    }    

    self._cache[vkey]= {value, ttl: rttl, when: (new Date()).getTime()}

    if (rttl) {
      const cleanerId = setTimeout(() => {
        self.logDebug(`Expiring ${key} after ${rttl} ms`)
        self.unsetItem(key, true)
      }, rttl)

      this._cleaners[vkey] = cleanerId
    }

    return true
  }

  async getItem(key) {
    const vkey = this.getInnerKey(key)
    return this._cache?.[vkey]?.['value']
  }

  async getItemTTL(key) {
    const vkey = this.getInnerKey(key)
    const element = this._cache?.[vkey]
    if (!element) {
      return
    }
    const ttl = this._cache[vkey]?.['ttl']
    if (! ttl) {
      return
    }
    const now = (new Date()).getTime()
    const when = this._cache[vkey]['when']

    return when-now
  }

  async unsetItem(key, auto) {
    const exists = await this.hasItem(key)
    if (!exists) {
      return false
    }

    const vkey = this.getInnerKey(key)

    if (auto !==true) {
      try {
        clearTimeout(this._cleaners[vkey])
      } catch {}
    }
    
    delete this._cleaners[vkey]
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