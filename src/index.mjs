import CacheStoreRaw from "./stores/raw.mjs"

function initCache (_store= 'raw') {
  const cache= new CacheStoreRaw()
  return cache  
}


export {initCache}

