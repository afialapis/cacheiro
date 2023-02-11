![Cacheiro logo](https://cacheiro.afialapis.com/logo.png)

[![NPM Version](https://badge.fury.io/js/cacheiro.svg)](https://www.npmjs.com/package/cacheiro)
[![NPM Downloads](https://img.shields.io/npm/dm/cacheiro.svg?style=flat)](https://www.npmjs.com/package/cacheiro)

`cacheiro` is the simplest -yet effective- cache manager.

# Install

```
npm install cacheiro [--save-dev]
```

# Getting Started

```js

import {initCache} from 'cacheiro'

// store_type: 'raw'
//   Currently just memory cache is supported
const cache= initCache(store_type)

cache.setItem('key', 'value')

cache.hasItem('key')
// true

cache.getKeys()
// ['key']

cache.getItem('key')
// 'value'

cache.unsetItem('key')

cache.getOrSetItem('key', 
  () => console.log('Value was there'),
  () => {
    console.log('Value is not there, let\'s create it')
    return 'value'
  } 
)
// Value is not there, let's create it
// => 'value'
```

# Future

Better cache technologies will be wrapped under `cacheiro`. [Redis](https://redis.io/), at least. Hopefully.
