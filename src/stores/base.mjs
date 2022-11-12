/*eslint no-unused-vars: ["warn", { "argsIgnorePattern": "key|value" }]*/


class CacheStore {
  constructor () {
  }

  getKeys() {
    throw 'calustra: CacheStore.getKeys() not implemented'
  }

  hasItem(key) {
    throw 'calustra: CacheStore.hasItem() not implemented'
  }

  setItem(key, value) {
    throw 'calustra: CacheStore.setItem() not implemented'
  }

  getItem(key) {
    throw 'calustra: CacheStore.getItem() not implemented'
  }

  unsetItem(key) {
    throw 'calustra: CacheStore.unsetItem() not implemented'
  }

  getOrSetItem(key, get_callback, set_callback) {
    if (this.hasItem(key)) {
      get_callback()
      return this.getItem(key)
    }

    const value= set_callback()
    this.setItem(key, value)
    return value    
  }

  async getOrSetItemAsync(key, get_callback, set_callback) {
    if (this.hasItem(key)) {
      await get_callback()
      return this.getItem(key)
    }

    const value= await set_callback()
    this.setItem(key, value)
    return value    
  }

}
  

export default CacheStore
