const ora = require('ora')
const { Processor } = require('../processor')
const stories = require('../__test__/__fixtures__/trees/multiple_stories')

class Runner {
  constructor({ reporter, finder, parser }) {
    this.reporter = reporter
    this.finder = finder
    this.parser = parser
    this.loader = ora({
      text: 'Running stories',
      color: 'green',
      spinner: 'line',
      interval: 75,
    })
    this.history = {
      passed: 0,
      failed: {},
    }
  }

  updateLoaderText() {
    const { passed, failed } = this.history

    this.loader.text = `Running stories (${passed} passed, ${
      Object.keys(failed).length
    } failed)`
  }

  async findStories() {
    // const stories = await this.finder.getStories()
    // const parsedStories = this.parser.parseStories(stories)

    // return parsedStories

    return stories
  }

  async processStory(story) {
    // this.reporter
    const storyProcessor = new Processor({
      reporter: this.reporter,
      step: story,
    })
    // console.log(storyProcessor)
    await storyProcessor.run()
  }

  async processStories(stories) {
    for (const story of stories) {
      try {
        await this.processStory(story)
        this.history.passed += 1
      } catch (err) {
        this.reporter.error(`❌    ${story.name} failed`)
        this.reporter.error(err)
        this.history.failed[story.name] = err
      } finally {
        this.updateLoaderText()
      }
    }
  }

  async run() {
    const stories = await this.findStories()

    this.loader.start()
    await this.processStories(stories)
    this.loader.stop()

    const { passed, failed } = this.history

    this.reporter.info(
      `${passed} passed, ${Object.keys(failed).length} failed. Done.`
    )
    process.exit()
  }
}

module.exports = {
  Runner,
}
