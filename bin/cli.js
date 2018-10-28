#!/usr/bin/env node

const minimist = require('minimist')

const { open = false, ...args } = minimist(process.argv.slice(2))
const story = args.s || args.story || null

require('../src/index')({
  open,
  story,
})
