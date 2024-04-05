import assert from 'assert'
import {cacheiro} from '../../src/index.mjs'
import {cacheiroTestConfig} from '../config.mjs'

export function cacheiroCombinedTest() {

  describe(`Combined Test`, function () {
    this.timeout(2000)

    let cache

    it("should create the cache instance", async () => {   
      cache = await cacheiro(cacheiroTestConfig('combined', {version: 1, clean: true}))

      assert.strictEqual(cache.name, 'combined')
    })  

    it("should check the cache instance is clean", async () => {   
      const cache_keys = await cache.getKeys()
      assert.deepEqual(cache_keys, [])
    })      

    it("should set some nice value ", async () => { 
      const ok = await cache.setItem('nice_value', '1')
      
      assert.strictEqual(ok, true)
    })

    it("should emulate server start (only memory clean) ", async () => { 
      const nk = await cache._memory.unsetAll()
      
      assert.strictEqual(nk, 1)
    })    

    it("should check nice value is on combined", async () => { 
      const exists = await cache.hasItem('nice_value')
      
      assert.strictEqual(exists, true)
    })

    it("should check nice value is on redis", async () => { 
      const exists = await cache._redis.hasItem('nice_value')
      
      assert.strictEqual(exists, true)
    })

    it("should check nice value is not on memory", async () => { 
      const exists = await cache._memory.hasItem('nice_value')
      
      assert.strictEqual(exists, false)
    })


    it("should get nice value from redis", async () => { 
      const value = await cache.getItem('nice_value')
      
      assert.strictEqual(value, '1')
    })


    it("should get nice value (now also from memory)", async () => { 
      const value = await cache._memory.getItem('nice_value')
      
      assert.strictEqual(value, '1')
    })

    it("should clean nice value ", async () => { 
      const ok = await cache.unsetItem('nice_value')
      
      assert.strictEqual(ok, true)
    })

    it("should check nice value is not on combined", async () => { 
      const exists = await cache.hasItem('nice_value')
      
      assert.strictEqual(exists, false)
    })
    it("should check nice value is not on redis", async () => { 
      const exists = await cache._redis.hasItem('nice_value')
      
      assert.strictEqual(exists, false)
    })

    it("should check nice value is not on memory", async () => { 
      const exists = await cache._memory.hasItem('nice_value')
      
      assert.strictEqual(exists, false)
    })


  })

}
