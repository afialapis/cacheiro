/*eslint no-unused-vars: ["warn", { "argsIgnorePattern": "key|value" }]*/

import { initLogger } from "../logger/index.mjs"


export class BaseStore {
  constructor (name, config) {
    this.name    = name
    this.config  = config
    
    this._namespace = config?.namespace || ''
    this.version = isNaN(config?.version) ? 1 : parseInt(config.version)

    this.logger  = initLogger(config?.log)

    this.vsep    = config?.version_separator || '::'
  }

  logDebug(s) {
    this.logger.debug(`[cacheiro:${this.name}][${this._prefixVKey}] ${s}`)
  }

  logError(s) {
    this.logger.error(`[cacheiro:${this.name}][${this._prefixVKey}] ${s}`)
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
  