const path = require('path')
const { StoryParser } = require('src/parser')
const { readFile } = require('src/utils/fs')
const parsedCommonStory = require('__fixtures__/trees/common_story')
const parsedMultipleStories = require('__fixtures__/trees/multiple_stories')

describe('StoryParser', () => {
  let singleStory
  let multipleStories

  beforeAll(async () => {
    singleStory = await readFile(
      path.resolve(__dirname, '../__fixtures__/stories/common_story.md'),
      'utf8'
    )
    multipleStories = await readFile(
      path.resolve(__dirname, '../__fixtures__/stories/multiple_stories.md'),
      'utf8'
    )
  })

  describe('StoryParser – parseStory', () => {
    it('should correctly parse story without annotations', () => {
      const res = StoryParser.parseStory(singleStory)

      expect(res).toEqual(parsedCommonStory)
    })
  })

  describe('StoryParser – parseStories', () => {
    it('should correctly parse multiple stories without annotations', () => {
      const res = StoryParser.parseStories([multipleStories])

      expect(res).toEqual(parsedMultipleStories)
    })
  })
})
