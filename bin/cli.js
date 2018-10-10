#!/usr/bin/env node

const minimist = require('minimist')

const { debug = false, _: stories = [] } = minimist(process.argv.slice(2))

require('../src/index')({
  debug,
  stories,
})
