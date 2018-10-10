const path = require('path')
const { readDir, readFile } = require('../utils/fs')

const STORIES_PATH = path.resolve(process.cwd(), './stories')

class Finder {
  static async findStories() {
    const storiesPaths = await readDir(STORIES_PATH)

    return storiesPaths.map(story => path.resolve(STORIES_PATH, story))
  }

  static async readStories(storiesPaths) {
    const rawStories = []

    for (const story of storiesPaths) {
      const rawStory = await readFile(story, 'utf8')

      rawStories.push(rawStory)
    }

    return rawStories
  }

  static async getStories() {
    const stories = await this.findStories()
    const rawStories = await this.readStories(stories)

    return rawStories
  }
}

module.exports = {
  Finder,
}
