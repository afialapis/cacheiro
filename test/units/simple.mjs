import assert from 'assert'
import {initCache} from '../../src/index.mjs'
import {cacheiro_test_config} from '../config.mjs'
import data from '../data.mjs'

export function cacheiro_simple_test(cache_type) {

  describe(`${cache_type} Cache`, function () {
    this.timeout(100)

    let cache
    let all_keys = [] 

    it("should create the cache instance", async () => {   
      cache = await initCache(cacheiro_test_config(cache_type))

      assert.strictEqual(cache.name, cache_type)
    })  

    it("should set data", async () => { 
      

      for (const rec of data) {
        const [key, value] = rec
        await cache.setItem(key, value)
        all_keys.push(key)
      }
      all_keys.sort()

      const cache_keys = await cache.getKeys()
      cache_keys.sort()
      
      assert.deepEqual(cache_keys, all_keys)
    })    

    it("should clean data", async () => { 
      
      for (const k of all_keys) {
        await cache.unsetItem(k)
      }

      const cache_keys = await cache.getKeys()
      
      assert.deepEqual(cache_keys, [])
    }) 
  })


}



// Añadir tests especificos para combined
