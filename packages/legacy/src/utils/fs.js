const { last, split } = require('lodash/fp')
const fs = require('fs')
const { promisify } = require('util')

const readDir = promisify(fs.readdir)

const readFile = promisify(fs.readFile)

const isValidStoryFilepath = filepath => /.md$/.test(filepath)

const getFileNameFromPath = filepath => last(split('/')(filepath))

module.exports = {
  readDir,
  readFile,
  isValidStoryFilepath,
  getFileNameFromPath,
}
