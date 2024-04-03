export function cacheiro_test_config(ctype) {
  return {
    type: ctype,

    namespace: 'ctest',
    version: 1,
    
    redis: {
      host: '127.0.0.1',
      port: 6379
    },
    
    log: 'debug'
  }
}