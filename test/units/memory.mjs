import assert from 'node:assert'
import test from 'node:test'

import {cacheiro} from '../../src/index.mjs'
import {cacheiroTestConfig} from '../config.mjs'
import data from '../data.mjs'

const TTL = 1 * 300

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const CACHE_TYPE = 'memory'


test(`${CACHE_TYPE} Cache`, async function (t) {
  let cache
  let all_keys = [] 
  

  t.test("should create the cache instance", async () => {   
    cache = await cacheiro(cacheiroTestConfig(CACHE_TYPE, {version: 1, clean: true}))

    assert.strictEqual(cache.name, CACHE_TYPE)
  })  

  t.test("should check the cache instance is clean", async () => {   
    const cache_keys = await cache.getKeys()
    assert.deepEqual(cache_keys, [])
  })      

  t.test("should set data", async () => { 
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

  t.test("should clean data", async () => { 
    for (const k of all_keys) {
      await cache.unsetItem(k)
    }

    const cache_keys = await cache.getKeys()
    
    assert.deepEqual(cache_keys, [])
  }) 

  t.test("should set some ttl value ", async () => { 
    const ok = await cache.setItem('ttl_value', '1', TTL)
    
    assert.strictEqual(ok, true)
  })   

  t.test("wait ttl's half ", async () => { 
    await sleep(TTL/2)
  })    

  t.test("should check ttl value still exists", async () => { 
    const value = await cache.getItem('ttl_value')
    
    assert.strictEqual(value, '1')
  })   

  t.test("should check ttl value ", async () => { 
    // thisTTL is lower than TTL, cause it is the remaining time
    const thisTTL = await cache.getItemTTL('ttl_value')
    
    assert.ok(thisTTL <= (TTL/2))
  })     

  t.test("wait ttl finishes ", async () => { 
    await sleep(TTL/1.5)
  })    

  t.test("should check ttl value has been expired", async () => { 
    const exists = await cache.hasItem('ttl_value')
    
    assert.strictEqual(exists, false)
  })

  t.test("should set some nice value ", async () => { 
    const ok = await cache.setItem('nice_value', '1', TTL)
    
    assert.strictEqual(ok, true)
  })

  t.test("should close", async () => {   
    await cache.close()
  })

  t.test("should create the cache instance with version 2", async () => {   
    cache = await cacheiro(cacheiroTestConfig(CACHE_TYPE, {version: 2, clean: false}))

    assert.strictEqual(cache.name, CACHE_TYPE)
  })  

  t.test("should check nice value does not exist", async () => { 
    const exists = await cache.hasItem('nice_value')
    
    assert.strictEqual(exists, false)
  })

  t.test("should close", async () => {   
    await cache.close()
  })

  t.test("should revert the cache instance to version 1", async () => {   
    cache = await cacheiro(cacheiroTestConfig(CACHE_TYPE, {version: 1, clean: false}))

    assert.strictEqual(cache.name, CACHE_TYPE)
  })  


  t.test("should check nice value may exist or not (depending on cache type)", async () => { 
    const exists = await cache.hasItem('nice_value')
    const should = CACHE_TYPE != 'memory'
    
    assert.strictEqual(exists, should)
  })

  t.test("should clean nice value on v1", async () => { 
    const ok = await cache.unsetItem('nice_value')
    const should = CACHE_TYPE != 'memory'
    
    assert.strictEqual(ok, should)
  })

  t.test("should close", async () => {   
    await cache.close()
  })

  t.test("should revert the cache instance to version 2", async () => {   
    cache = await cacheiro(cacheiroTestConfig(CACHE_TYPE, {version: 2, clean: false}))

    assert.strictEqual(cache.name, CACHE_TYPE)
  })  

  t.test("should set some nice value ", async () => { 
    const ok = await cache.setItem('nice_value', '1', TTL)
    
    assert.strictEqual(ok, true)
  })    

  t.test("should clean nice value on v2", async () => { 
    const ok = await cache.unsetItem('nice_value')
    
    assert.strictEqual(ok, true)
  })    

  t.test("should check the cache instance v2 is clean", async () => {   
    const cache_keys = await cache.getKeys()
    assert.deepEqual(cache_keys, [])
  })

  t.test("should close", async () => {   
    await cache.close()
  })
})

