import { cacheiro_memory_store_init   } from "./stores/memory.mjs"
import { cacheiro_redis_store_init    } from "./stores/redis.mjs"
import { cacheiro_combined_store_init } from "./stores/combined.mjs"

async function initCache (config) {
  const type = config?.type || 'memory'
  
  const storeInit = type=='redis'
    ? cacheiro_redis_store_init
    : type=='combined'
      ? cacheiro_combined_store_init
      : cacheiro_memory_store_init
  
  const cache= await storeInit(config)
  return cache  
}


export {initCache}

