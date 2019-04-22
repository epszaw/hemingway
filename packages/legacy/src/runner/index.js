const ora = require('ora')
const { bold } = require('chalk')
const { Processor } = require('../processor')
const { info, error } = require('../utils/log')
const { storiesNotFound } = require('../notifications')

class Runner {
  constructor({ finder, parser, args, open }) {
    this.headless = !open
    this.args = args
    this.finder = finder
    this.parser = parser
    this.loader = ora({
      text: 'Running stories...',
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
    } failed).`
  }

  createLog() {
    // TODO: move logging to external function. May be to notifications
    Object.keys(this.history.failed).forEach(key => {
      const { def, message } = this.history.failed[key]

      error('---')
      error(`${bold('Story')}: ${key}`)
      error(`${bold('Action')}: ${def}`)
      error(`${bold('Error')}: ${message}`)
    })
  }

  async getStories(storyPath) {
    let rawStories = []

    try {
      const res = storyPath
        ? await this.finder.getStoryByPath(storyPath)
        : await this.finder.getStories()

      rawStories = rawStories.concat(res)
    } catch (err) {
      storiesNotFound(storyPath)
      process.exit(1)
    }

    return this.parser.parseStories(rawStories)
  }

  async processStory(story) {
    const storyProcessor = new Processor({
      headless: this.headless,
      args: this.args,
      story,
    })

    await storyProcessor.run()
  }

  async processStories(stories) {
    for (const story of stories) {
      try {
        await this.processStory(story)
        this.history.passed += 1
      } catch (err) {
        this.history.failed[story.name] = err
      } finally {
        this.updateLoaderText()
      }
    }
  }

  async run(storyPath) {
    const stories = await this.getStories(storyPath)

    this.loader.start()
    await this.processStories(stories)
    this.loader.stop()

    const { passed, failed } = this.history
    const hasError = Object.keys(failed).length > 0

    if (hasError) {
      error(
        `${passed} passed, ${
          Object.keys(failed).length
        } failed. Done with errors, see log below.`
      )
      this.createLog()
      process.exit(1)
    } else {
      // TODO: create method for outputing
      info(`${passed} passed, ${Object.keys(failed).length} failed. Done.`)
      process.exit()
    }
  }
}

module.exports = {
  Runner,
}
