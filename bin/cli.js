#!/usr/bin/env node

const minimist = require('minimist')

const { open = false, _: stories = [] } = minimist(process.argv.slice(2))

require('../src/index')({
  open,
  stories,
})
