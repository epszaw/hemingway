const path = require('path')
const { StoryParser } = require('src/parser')
const { readFile } = require('src/utils/fs')

const parsedCommonStory = require('__fixtures__/parsed/common_story')
const parsedMultipleStories = require('__fixtures__/parsed/multiple_stories')
const parsedArgumentsStory = require('__fixtures__/parsed/arguments')

const readRawStoryFixture = async name => {
  const res = await readFile(
    path.resolve(__dirname, `../__fixtures__/raw/${name}.md`),
    'utf8'
  )

  return res
}

describe('StoryParser', () => {
  let singleStory
  let multipleStories
  let untitledStory
  let titledStory
  let argumentsStory

  beforeAll(async () => {
    singleStory = await readRawStoryFixture('common_story')
    multipleStories = await readRawStoryFixture('multiple_stories')
    untitledStory = await readRawStoryFixture('untitled_story')
    titledStory = await readRawStoryFixture('titled_story')
    argumentsStory = await readRawStoryFixture('arguments')
  })

  describe('StoryParser – signStoriesNames', () => {
    it('should add filename as story title if title is not exist', () => {
      expect(
        StoryParser.signStoriesNames([
          {
            filename: 'untitled_story.md',
            source: untitledStory,
          },
        ])
      ).toEqual([titledStory])
    })
  })

  describe('StoryParser – parseAction', () => {
    it('should parse action string to correct object', () => {
      const res = StoryParser.parseAction(`FIND ".bar" HAVE "length"`)

      expect(res).toEqual({
        def: 'FIND ".bar" HAVE "length"',
        commands: [
          {
            name: 'FIND',
            args: ['.bar'],
          },
          {
            name: 'HAVE',
            args: ['length'],
          },
        ],
      })
    })

    it('should correctly parse action string with separated arguments', () => {
      const res = StoryParser.parseAction(
        `FIND ".foo [data-test='bar']" HAVE "length"`
      )

      expect(res).toEqual({
        def: `FIND ".foo [data-test='bar']" HAVE "length"`,
        commands: [
          {
            name: 'FIND',
            args: [`.foo [data-test='bar']`],
          },
          {
            name: 'HAVE',
            args: ['length'],
          },
        ],
      })
    })
  })

  describe('StoryParser – parseStory', () => {
    it('should correctly parse story without annotations', () => {
      const res = StoryParser.parseStory(singleStory)

      expect(res).toEqual(parsedCommonStory)
    })

    it('should correctly parse actions with separated arguments', () => {
      const res = StoryParser.parseStory(argumentsStory)

      expect(res).toEqual(parsedArgumentsStory)
    })
  })

  describe('StoryParser – parseStories', () => {
    it('should correctly parse multiple stories without annotations', () => {
      const res = StoryParser.parseStories([
        {
          filename: 'stories.md',
          source: multipleStories,
        },
      ])

      expect(res).toEqual(parsedMultipleStories)
    })
  })
})
