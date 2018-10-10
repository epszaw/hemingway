const { Runner } = require('./runner')
const { Finder } = require('./finder')
const { StoryParser } = require('./parser')

/* eslint-disable-next-line */
const hemingway = async args => {
  const runner = new Runner({ finder: Finder, parser: StoryParser })

  await runner.run()
}

module.exports = hemingway
