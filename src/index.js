const { Runner } = require('./runner')
const { Finder } = require('./finder')
const { StoryParser } = require('./parser')

/* eslint-disable-next-line */
const hemingway = async ({ open, stories }) => {
  const runner = new Runner({
    finder: Finder,
    parser: StoryParser,
    open,
  })

  await runner.run(stories)
}

module.exports = hemingway
