before(async function(){
  // console.log('Preloading functions (ESM) for being used in test units (CJS)')
  const {initCache} = await import( "../../src/index.mjs")

  global.initCache = initCache
})

