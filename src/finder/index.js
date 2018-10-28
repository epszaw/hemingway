const { filter } = require('lodash/fp')
const path = require('path')
const {
  readDir,
  readFile,
  isValidStoryFilepath,
  getFileNameFromPath,
} = require('../utils/fs')

const STORIES_PATH = path.resolve(process.cwd(), './stories')

class Finder {
  static async findStories() {
    const storiesPaths = await readDir(STORIES_PATH)

    return storiesPaths.map(story => path.resolve(STORIES_PATH, story))
  }

  static async findStoriesByPaths(storiesPaths) {
    for (const storyPath of storiesPaths) {
      try {
        // TODO: check is file exist or not. Dont read it!!!
        // TODO: Also add notification
        // const res = await
      } catch (err) {}
    }
  }

  static async readStories(storiesPaths) {
    const filteredStoriesPaths = filter(isValidStoryFilepath)(storiesPaths)
    const rawStories = []

    for (const storyPath of filteredStoriesPaths) {
      const rawStory = await readFile(storyPath, 'utf8')

      rawStories.push({
        filename: getFileNameFromPath(storyPath),
        source: rawStory,
      })
    }

    return rawStories
  }

  static async getStoriesByPaths(storiesPaths) {
    const stories = await this.findStoriesByPaths(storiesPaths)
    const rawStories = await this.readStories(stories)

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
