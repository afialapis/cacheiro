
import Logger from './Logger.mjs'

export function cacheiroInitLogger(options) {
  let logger
  if ( (options==undefined) || (typeof options == 'string')) {
    logger= new Logger(options || 'info')
  } else {
    logger = options
  }

  return logger
}
