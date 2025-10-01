import assert from 'assert'
import {cacheiroTestConfig} from '../config.mjs'
import data from '../data.mjs'

const TTL = 1 * 1000

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function cacheiroSimpleTest(cache_type) {
  const cacheiro = global.cacheiro

  describe(`${cache_type} Cache`, function () {
    this.timeout(TTL*4)

    let cache
    let all_keys = [] 
    

    it("should create the cache instance", async () => {   
      cache = await cacheiro(cacheiroTestConfig(cache_type, {version: 1, clean: true}))

      assert.strictEqual(cache.name, cache_type)
    })  

    it("should check the cache instance is clean", async () => {   
      const cache_keys = await cache.getKeys()
      assert.deepEqual(cache_keys, [])
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

    it("should set some ttl value ", async () => { 
      const ok = await cache.setItem('ttl_value', '1', TTL)
      
      assert.strictEqual(ok, true)
    })   

    it("wait ttl's half ", async () => { 
      await sleep(TTL/2)
    })    

    it("should check ttl value still exists", async () => { 
      const value = await cache.getItem('ttl_value')
      
      assert.strictEqual(value, '1')
    })   

    it("should check ttl value ", async () => { 
      // thisTTL is lower than TTL, cause it is the remaining time
      const thisTTL = await cache.getItemTTL('ttl_value')
      
      assert.ok(thisTTL <= (TTL/2))
    })     

    it("wait ttl finishes ", async () => { 
      await sleep(TTL/1.5)
    })    

    it("should check ttl value has been expired", async () => { 
      const exists = await cache.hasItem('ttl_value')
      
      assert.strictEqual(exists, false)
    })

    it("should set some nice value ", async () => { 
      const ok = await cache.setItem('nice_value', '1', TTL)
      
      assert.strictEqual(ok, true)
    })

    it("should create the cache instance with version 2", async () => {   
      cache = await cacheiro(cacheiroTestConfig(cache_type, {version: 2, clean: false}))

      assert.strictEqual(cache.name, cache_type)
    })  

    it("should check nice value does not exist", async () => { 
      const exists = await cache.hasItem('nice_value')
      
      assert.strictEqual(exists, false)
    })

    it("should revert the cache instance to version 1", async () => {   
      cache = await cacheiro(cacheiroTestConfig(cache_type, {version: 1, clean: false}))

      assert.strictEqual(cache.name, cache_type)
    })  


    it("should check nice value may exist or not (depending on cache type)", async () => { 
      const exists = await cache.hasItem('nice_value')
      const should = cache_type != 'memory'
      
      assert.strictEqual(exists, should)
    })

    it("should clean nice value on v1", async () => { 
      const ok = await cache.unsetItem('nice_value')
      const should = cache_type != 'memory'
      
      assert.strictEqual(ok, should)
    })

    it("should revert the cache instance to version 2", async () => {   
      cache = await cacheiro(cacheiroTestConfig(cache_type, {version: 2, clean: false}))

      assert.strictEqual(cache.name, cache_type)
    })  

    it("should set some nice value ", async () => { 
      const ok = await cache.setItem('nice_value', '1', TTL)
      
      assert.strictEqual(ok, true)
    })    

    it("should clean nice value on v2", async () => { 
      const ok = await cache.unsetItem('nice_value')
      
      assert.strictEqual(ok, true)
    })    

    it("should check the cache instance v2 is clean", async () => {   
      const cache_keys = await cache.getKeys()
      assert.deepEqual(cache_keys, [])
    })

  })

}
