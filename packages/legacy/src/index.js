const { Runner } = require('./runner')
const { Finder } = require('./finder')
const { StoryParser } = require('./parser')

/* eslint-disable-next-line */
const hemingway = async ({ open, story }) => {
  const runner = new Runner({
    finder: Finder,
    parser: StoryParser,
    open,
  })

  await runner.run(story)
}

module.exports = hemingway
