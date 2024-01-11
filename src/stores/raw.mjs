import CacheSore from './base.mjs'

class CacheStoreRaw extends CacheSore {
  constructor (config) {
    super(config)
    this._cache= {}
  }

  getKeys() {
    return Object.keys(this._cache)
  }

  hasItem(key) {
    return Object.prototype.hasOwnProperty.call(this._cache, key)
  }

  setItem(key, value, expirationTime= undefined) {
    this._cache[key]= value
    if (expirationTime) {
      setTimeout(() => {
        this.unsetItem(key)
      }, expirationTime)
    }
  }

  getItem(key) {
    return this._cache[key]
  }

  unsetItem(key) {
    if (this.hasItem(key)) {
      delete this._cache[key]
    }
  }
}

export default CacheStoreRaw