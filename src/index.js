const { Reporter } = require('./reporter')
const { Runner } = require('./runner')
const { Finder } = require('./finder')
const { Parser } = require('./parser')

/* eslint-disable-next-line */
const hemingway = async args => {
  const reporter = new Reporter()
  const finder = new Finder()
  const runner = new Runner({ reporter, finder, parser: Parser })

  await runner.run()
}

module.exports = hemingway
