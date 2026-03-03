### 0.4.0

Upgraded `xeira`, which means Node >= 21

### 0.3.1

`instanceof redis.ReplyError` causes error `TypeError: Right-hand side of 'instanceof' is not an object` when running inside Docker. 
Still dunno why. Just try-catching by now.

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
