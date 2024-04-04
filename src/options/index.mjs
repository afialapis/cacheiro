export function cacheiroMergeOptions(options) {
  return {
    type: options?.type || 'memory',

    namespace: options?.namespace || 'cacheiro',
    version: options?.version || 1,
    clean: options?.clean == true,
    
    redis: {
      host: '127.0.0.1',
      port: 6379
    },

    ttl: options?.ttl || 86400000 * 30,
    
    log: options?.log || 'debug'
  }
}