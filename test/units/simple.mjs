import assert from 'assert'
import {initCache} from '../../src/index.mjs'
import {cacheiro_test_config} from '../config.mjs'
import data from '../data.mjs'

export function cacheiro_simple_test(cache_type) {

  describe('memory Cache', function () {
    this.timeout(100)

    let cache

    it("should create the cache instance", async () => {   
      cache = await initCache(cacheiro_test_config(cache_type))

      assert.strictEqual(cache.name, cache_type)
    })  

    it("should set data", async () => { 
      let all_keys = []

      for (const rec of data) {
        const [key, value] = rec
        await cache.setItem(key, value)
        all_keys.push(key)
      }

      const cache_keys = await cache.getKeys()
      
      assert.deepEqual(cache_keys, all_keys)
    })    
  })


}
