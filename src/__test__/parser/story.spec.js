const path = require('path')
const { StoryParser } = require('src/parser')
const { readFile } = require('src/utils/fs')

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
  let operatorsStory
  let unsupportedOperatorStory

  beforeAll(async () => {
    singleStory = await readRawStoryFixture('common_story')
    multipleStories = await readRawStoryFixture('multiple_stories')
    untitledStory = await readRawStoryFixture('untitled_story')
    titledStory = await readRawStoryFixture('titled_story')
    argumentsStory = await readRawStoryFixture('arguments')
    operatorsStory = await readRawStoryFixture('operators')
    unsupportedOperatorStory = await readRawStoryFixture('unsupported_operator')
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
            modifier: null,
            args: ['.bar'],
          },
          {
            name: 'HAVE',
            modifier: null,
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
            modifier: null,
            args: [`.foo [data-test='bar']`],
          },
          {
            name: 'HAVE',
            modifier: null,
            args: ['length'],
          },
        ],
      })
    })
  })

  describe('StoryParser – parseStory', () => {
    it('should correctly parse story without annotations', () => {
      const res = StoryParser.parseStory(singleStory)

      expect(res).toMatchSnapshot()
    })

    it('should correctly parse actions with separated arguments', () => {
      const res = StoryParser.parseStory(argumentsStory)

      expect(res).toMatchSnapshot()
    })

    it('should correctly parse story with diffirent operators', () => {
      const res = StoryParser.parseStory(operatorsStory)

      expect(res).toMatchSnapshot()
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

      expect(res).toMatchSnapshot()
    })

    it('should not pass stories with unsupported operators', () => {
      const res = StoryParser.parseStories([
        {
          filename: 'unsupported_operators.md',
          source: unsupportedOperatorStory,
        },
      ])

      expect(res).toMatchSnapshot()
    })
  })

  describe('StoryParser – appendModifier', () => {
    it('should returns given object with unbinded modifier', () => {
      const acc = {
        commands: [
          {
            name: 'TAKE',
            modifier: null,
            args: [],
          },
        ],
      }
      const modifier = 'NOT'

      expect(StoryParser.appendModifier(acc, modifier)).toEqual({
        commands: [
          {
            name: 'TAKE',
            modifier: null,
            args: [],
          },
          {
            name: null,
            modifier,
            args: [],
          },
        ],
      })
    })
  })

  describe('StoryParser – appendOperatorToModifier', () => {
    it('should returns given object with merge of last modifier and new command', () => {
      const acc = {
        commands: [
          {
            name: 'TAKE',
            modifier: null,
            args: [],
          },
          {
            name: null,
            modifier: 'NOT',
            args: [],
          },
        ],
      }
      const operator = 'FIND'

      expect(StoryParser.appendOperatorToModifier(acc, operator)).toEqual({
        commands: [
          {
            name: 'TAKE',
            modifier: null,
            args: [],
          },
          {
            name: 'FIND',
            modifier: 'NOT',
            args: [],
          },
        ],
      })
    })
  })

  describe('StoryParser – appendOperator', () => {
    it('should returns given object with new command ', () => {
      const acc = {
        commands: [
          {
            name: 'TAKE',
            modifier: null,
            args: [],
          },
        ],
      }
      const operator = 'FIND'

      expect(StoryParser.appendOperator(acc, operator)).toEqual({
        commands: [
          {
            name: 'TAKE',
            modifier: null,
            args: [],
          },
          {
            name: 'FIND',
            modifier: null,
            args: [],
          },
        ],
      })
    })
  })

  describe('StoryParser – appendArguments', () => {
    it('should returns given object and expand last command arguments', () => {
      const acc = {
        commands: [
          {
            name: 'TAKE',
            modifier: null,
            args: [],
          },
          {
            name: 'FIND',
            modifier: null,
            args: [],
          },
        ],
      }
      const args = 'hello world'

      expect(StoryParser.appendArguments(acc, args)).toEqual({
        commands: [
          {
            name: 'TAKE',
            modifier: null,
            args: [],
          },
          {
            name: 'FIND',
            modifier: null,
            args: ['hello world'],
          },
        ],
      })
    })
  })
})
