[![NPM Version](https://badge.fury.io/js/cacheiro.svg)](https://www.npmjs.com/package/cacheiro)
[![Dependency Status](https://david-dm.org/afialapis/cacheiro.svg)](https://david-dm.org/afialapis/cacheiro)
[![NPM Downloads](https://img.shields.io/npm/dm/cacheiro.svg?style=flat)](https://www.npmjs.com/package/cacheiro)

# Table of Contents

1. [Intro](#intro)
2. [Install](#install)
3. [Getting Started](#getting-started)

# Intro

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
// 'value'

```
