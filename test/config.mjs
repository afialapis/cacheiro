export function cacheiroTestConfig(ctype, options) {
  return {
    type: ctype,

    namespace: 'ctest',
    version: options?.version || 1,
    clean: options?.clean == true,
    
    redis: {
      host: '127.0.0.1',
      port: 6379
    },

    ttl: 1000 * 10,
    
    log: 'debug'
  }
}