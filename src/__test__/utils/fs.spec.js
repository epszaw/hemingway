const path = require('path')
const { readDir, readFile } = require('src/utils/fs')

describe('utils – fs', () => {
  const FIXTURES_PATH = path.resolve(__dirname, '../__fixtures__')

  describe('readDir', () => {
    it('should returns folder content', async () => {
      expect.assertions(1)

      const res = await readDir(FIXTURES_PATH)

      expect(res).toEqual(['stories', 'trees'])
    })
  })

  describe('readFile', () => {
    it('should returns file content in given encoding', async () => {
      expect.assertions(1)

      const res = await readFile(
        path.join(FIXTURES_PATH, './stories/common_story.md'),
        'utf8'
      )

      expect(res).toMatchSnapshot()
    })
  })
})
