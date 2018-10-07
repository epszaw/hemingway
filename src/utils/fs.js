const fs = require('fs')
const { promisify } = require('util')

const readDir = promisify(fs.readdir)

const readFile = promisify(fs.readFile)

module.exports = {
  readDir,
  readFile,
}
