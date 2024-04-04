/*eslint no-unused-vars: ["warn", { "argsIgnorePattern": "key|value" }]*/

import { cacheiroInitLogger } from "../logger/index.mjs"



export class BaseStore {
  constructor (name, options) {
    this.name    = name
    this.options  = options
    
    this._namespace = options.namespace
    this.version = isNaN(options?.version) ? 1 : parseInt(options.version)

    this.logger  = cacheiroInitLogger(options?.log)

    this.vsep    = options?.version_separator || '::'
  }

  logDebug(s) {
    this.logger.debug(`[cacheiro:${this.name}][${this._prefixVKey}] ${s}`)
  }

  logError(s) {
    this.logger.error(`[cacheiro:${this.name}][${this._prefixVKey}] ${s}`)
  }

  getTTL(ttl) {
    if (! isNaN(ttl)) {
      return parseInt(ttl)
    }
    return parseInt(this.options.ttl)
  }
  
  get _prefixVKey() {
    let ns= ''
    if (this._namespace) {
      ns= `${this._namespace}${this.vsep}`
    }
    return `${ns}${this.version}${this.vsep}`
  }

  makeVkey(key) {
    return `${this._prefixVKey}${key}`
  }

  stripVKey(vkey) {
    if (! vkey) {
      return vkey
    }

    return vkey.slice(this._prefixVKey.length)   
  }

  async getKeys(pattern) {
    throw 'calustra: BaseStore.getKeys() not implemented'
  }

  async hasItem(key) {
    throw 'calustra: BaseStore.hasItem() not implemented'
  }

  async setItem(key, value) {
    throw 'calustra: BaseStore.setItem() not implemented'
  }

  async getItem(key) {
    throw 'calustra: BaseStore.getItem() not implemented'
  }

  async unsetItem(key) {
    throw 'calustra: BaseStore.unsetItem() not implemented'
  }

  async unsetAll(pattern) {
    const keys = await this.getKeys(pattern)
    for (const k of keys) {
      await this.unsetItem(k)
    }
    return keys.length
  }

  async getOrSetItem(key, callback) {
    let value 

    const exists = await this.hasItem(key)
    if (exists) {
      value = await this.getItem(key)
    } else {
      value = await callback()
      await this.setItem(key, value)
    }
    return value   
  }

}
  