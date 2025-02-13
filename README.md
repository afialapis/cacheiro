# cacheiro
[![NPM Version](https://badge.fury.io/js/cacheiro.svg)](https://www.npmjs.com/package/cacheiro)
[![NPM Downloads](https://img.shields.io/npm/dm/cacheiro.svg?style=flat)](https://www.npmjs.com/package/cacheiro)

![Cacheiro logo](https://www.afialapis.com/os/cacheiro/logo.png)

---

> **cacheiro**. substantivo masculino:

> **Porco semental.**

> _Levar a porca ao cacheiro._

---

## Intro

`cacheiro` is the simplest -yet effective- cache manager.

## Install

```
npm install cacheiro
```

## Getting Started

```js
import {cacheiro} from 'cacheiro'

const options = {
  type: 'combined', // or 'memory' or 'redis'
  redis: {
    host: '127.0.0.1',
    port: 6379
  },
  namespace: 'my_cache',
  version: 1,
  clean: true,
  ttl: 86400 * 1000 * 30,
  log: 'debug'
}

const cache= await cacheiro(options)

await cache.setItem('key', 'value')
// true
await cache.hasItem('key')
// true
await cache.getKeys()
// ['key']
await cache.getItem('key')
// 'value'
await cache.unsetItem('key')
// true
await cache.getOrSetItem('key', 
  () => {
    console.log('Value is not there, let\'s create it')
    return 'value'
  } 
)
// Value is not there, let's create it
// => 'value'
await cache.unsetAll()
// 1
```

## API

### `await cacheiro(options)`
Creates and inits the cache store. 

#### `type`

- `memory`: cache stuff directly on memory. If you loose the variable, you lose the cache.
- `redis`: use [`node-redis`](https://github.com/redis/node-redis) as caching layer. You need to pass `options.redis` field.
- `combined`: combination of both `memory` and `redis`. You need to pass `options.redis` field. `memory` cache will act as a read-only replica of `redis`.

#### `redis`
_Redis_ connection parameters. Refer to [`node-redis`](https://github.com/redis/node-redis) for further info.

#### `namespace`
Prefix to be used for all the cache keys managed by `cacheiro`. Default is `'cacheiro'`.

#### `version`
Handle cached data versions to easily unvalidate previous content. Default is `1`.

#### `clean`
If `true`, cache will be clean right after initialization. (It applies only to `redis` or `combined`). Default is `false`.

#### `ttl`
Expiration time in miliseconds for the cached values. They can be setted also at item level on `cache.setItem(key, value, ttl)`. Default is `86400000`, 1 day.
Notice that for `memory` cache, `ttl` is handled though `setTimeout`. This has a limit of 32-buit integers (max `ttl` is `2147483647`, a bit less of 25 days).

#### `log`
It can be a string with the log level (`silly`, `debug`, `info`, `warn`, `error`) or a class exposing methods named as those log levels, for example:

```js
  log: class CustomLogger {
    _log(l, s) {
      console.log(`[${l}] ${s}`)
    }
    
    silly(s) { this.log('silly', s) }
    debug(s) { this.log('debug', s) }
    info(s)  { this.log('info', s) }
    warn(s)  { this.log('warn', s) }
    error(s) { this.log('error', s) }
  }
}
```

Default is `debug`.

### `await setItem(key, value, ttl = <ms>)`
Stores a `value` in the cache, identified by `key`. If specified, `ttl` is the expiration time (or [Time To Live](https://en.wikipedia.org/wiki/Time_to_live)) in miliseconds.


### `await getItem(key)`
Returns, if exists, stored `value` for `key`. `undefined` otherwise.

### `await hasItem(key)`
Returns `true` if there is some `value` stored for `key`. `false` otherwise.

### `await unsetItem(key)`
Removes from cache any `value` stored for `key`. Returns `true` if there was some `value` stored. `false` otherwise.

### `await getKeys(`[`pattern`](#pattern-parameter)`)`
Returns an array of `keys` present in the cache and matching `pattern`.

### `await getAll(`[`pattern`](#pattern-parameter)`)`
Returns an object like {`key`: `value`...} of all the stuff present in the cache and matching `pattern`.

### `await getValues(`[`pattern`](#pattern-parameter)`)`
Returns an array of all the values present in the cache whose `key` is matching `pattern`.

### `await unsetAll(`[`pattern`](#pattern-parameter)`)`
Removes from cache all values matching `pattern`.

### `pattern` parameter
In the case of `redis` or `combined` caches, `pattern` is handled by [Redis](https://redis.io/commands/keys/).

In the case of `memory` cache, `cacheiro` will create a [`RegExp(pattern)`](#memory-cache-and-pattern-in-getkeys), unless you specify no pattern or the `'*'` wildcard value. 


## TODO

 * Detect _Redis_ is installed in the system: and, if not, failback to `memory` cache.
 * `memory` cache and `ttl`: find a better expiring method than `setTimeout()`. Probably passing a `cron` through `options`.
 * `memory` cache and `pattern`: find a beter solution than `RegExp`. Something closer to `Redis` `pattern`'s handling.


## Changelog

### 0.3.0

Upgraded `xeira` and `redis`.

### 0.1.3

Fix `logger.warning` => `logger.warn`.

### 0.1.2

Limit `memory` cache's `ttl` to the max 32-bit `int` (`2147483647`). Show warning if greater value was passed.

### 0.1.1

Added `getAll(pattern)` and `getValues(pattern)` methods.
`initCache()` is now `cacheiro()`.

### 0.1.0
Created `redis` and `combined` stores. `raw` is now `memory`.
Every method is now `async`.
npm run test
