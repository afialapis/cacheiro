import {cacheiroSimpleTest} from './units/simple.mjs'
import {cacheiroCombinedTest} from './units/combined.mjs'

import {cacheiro} from '../dist/cacheiro.node.bundle.mjs'
global.cacheiro = cacheiro


cacheiroSimpleTest('memory')
cacheiroSimpleTest('redis')
cacheiroSimpleTest('combined')

cacheiroCombinedTest()