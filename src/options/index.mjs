export function cacheiroMergeOptions(options) {
  let mopts = {
    type: options?.type || 'memory',

    namespace: options?.namespace || 'cacheiro',
    version: options?.version || 1,
    clean: options?.clean == true,
    
    ttl: options?.ttl || 86400 * 1000,
    
    log: options?.log || 'debug'
  }

  if (options?.redis) {
    // 
    // redis: {
    //   host: '127.0.0.1',
    //   port: 6379
    // }
    //

    mopts.redis = options.redis
  }

  return mopts
}