/*eslint no-unused-vars: ["warn", { "argsIgnorePattern": "key|value" }]*/

import { cacheiroInitLogger } from "../logger/index.mjs"
import {red, yellow} from 'tinguir'


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

  logWarning(s) {
    this.logger.warn(`[cacheiro:${this.name}][${this._prefixVKey}] ${yellow(s)}`)
  }

  logError(s) {
    this.logger.error(`[cacheiro:${this.name}][${this._prefixVKey}] ${red(s)}`)
  }

  getTTL(ttl) {
    if (! isNaN(ttl)) {
      return parseInt(ttl)
    }
    if (! isNaN(this.options.ttl)) {
      return parseInt(this.options.ttl)
    }
    return undefined
  }
  
  get _prefixVKey() {
    let ns= ''
    if (this._namespace) {
      ns= `${this._namespace}${this.vsep}`
    }
    return `${ns}${this.version}${this.vsep}`
  }

  getInnerKey(key) {
    return `${this._prefixVKey}${key}`
  }

  getExternalKey(vkey) {
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

  async getItemTTL(key) {
    throw 'calustra: BaseStore.getItemTTL() not implemented'
  }


  async unsetItem(key) {
    throw 'calustra: BaseStore.unsetItem() not implemented'
  }

  async getAll(pattern) {
    const vmap = {}
    const keys = await this.getKeys(pattern)
    for (const k of keys) {
      const v = await this.getItem(k)
      vmap[k] = v
    }
    return vmap
  }

  async getValues(pattern) {
    const vmap = await this.getAll(pattern)
    return Object.values(vmap)
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

  async close() {
    throw 'calustra: BaseStore.close() not implemented'
  }

}
  