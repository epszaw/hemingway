const path = require('path')
const {
  readDir,
  readFile,
  isValidStoryFilepath,
  getFileNameFromPath,
} = require('src/utils/fs')

describe('utils – fs', () => {
  const FIXTURES_PATH = path.resolve(__dirname, '../__fixtures__')

  describe('readDir', () => {
    it('should returns folder content', async () => {
      expect.assertions(1)

      const res = await readDir(FIXTURES_PATH)

      expect(res).toMatchSnapshot()
    })
  })

  describe('readFile', () => {
    it('should returns file content in given encoding', async () => {
      expect.assertions(1)

      const res = await readFile(
        path.join(FIXTURES_PATH, './raw/common_story.md'),
        'utf8'
      )

      expect(res).toMatchSnapshot()
    })
  })

  describe('isValidStoryFilepath', () => {
    it('should pass only .md files paths', () => {
      expect(isValidStoryFilepath('/stories/story.md')).toBe(true)
      expect(isValidStoryFilepath('/stories/story')).toBe(false)
    })
  })

  describe('getFileNameFromPath', () => {
    it('should returns filename with extension from file path', () => {
      expect(getFileNameFromPath('/stories/story.md')).toEqual('story.md')
      expect(getFileNameFromPath('/stories/story.separator.md')).toEqual(
        'story.separator.md'
      )
    })
  })
})
