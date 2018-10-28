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

  static async readStoryByPath(storyPath) {
    const res = await readFile(path.resolve(process.cwd(), storyPath), 'utf8')

    return {
      filename: getFileNameFromPath(storyPath),
      source: res,
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

  static async getStoryByPath(storyPath) {
    try {
      const story = await this.readStoryByPath(storyPath)

      return story
    } catch (err) {
      console.log(err)
    }
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
