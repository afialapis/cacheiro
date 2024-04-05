import { cacheiroMergeOptions } from "./options/index.mjs"
import { cacheiroMemoryStoreInit   } from "./stores/memory.mjs"
import { cacheiroRedisStoreInit    } from "./stores/redis.mjs"
import { cacheiroCombinedStoreInit } from "./stores/combined.mjs"

async function cacheiro (options) {
  const moptions = cacheiroMergeOptions(options)

  const storeInit = moptions.type=='redis'
    ? cacheiroRedisStoreInit
    : moptions.type=='combined'
      ? cacheiroCombinedStoreInit
      : cacheiroMemoryStoreInit
  
  const cache= await storeInit(moptions)
  return cache  
}


export {cacheiro}

