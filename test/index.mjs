import {cacheiroSimpleTest} from './units/simple.mjs'
import {cacheiroCombinedTest} from './units/combined.mjs'


cacheiroSimpleTest('memory')
cacheiroSimpleTest('redis')
cacheiroSimpleTest('combined')

cacheiroCombinedTest()