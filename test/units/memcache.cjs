const expect= global.expect

describe('memory Cache', function () {
  this.timeout(100)

  let cache

  const data= {
    'key_one': 'Data for Key One',
    'key_two': 'Data for Key Two'
  }

  const keys = Object.keys(data)

  it("should create the cache instance", async () => {   
    cache = global.initCache()

    expect( cache.constructor.name.indexOf('CacheStore')).to.equal(0)
  })  

  it("should set some value", async () => {   
    for (const key of keys) {
      const value = data[key]
      cache.setItem(key, value)
    }

    expect( cache.getKeys()).to.eql(keys)
  })    
})



