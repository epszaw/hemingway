const { Processor } = require('./processor')
const { Reporter } = require('./reporter')
const short = require('./__test__/__fixtures__/trees/short_story')

const hemingway = async () => {
  const reporter = new Reporter()
  const processor = new Processor(reporter, short)

  await processor.run()
}

module.exports = hemingway
