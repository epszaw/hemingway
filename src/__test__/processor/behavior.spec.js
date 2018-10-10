const { Processor } = require('src/processor')
const shortStory = require('__fixtures__/parsed/common_story')

describe('Processor', () => {
  beforeAll(() => {
    jest.setTimeout(30000)
  })

  describe('step processing', () => {
    it('common_story.json run (with common operators)', async () => {
      expect.assertions(2)

      const stepProcessor = new Processor(shortStory)

      jest.spyOn(stepProcessor, 'processAction')
      jest.spyOn(stepProcessor, 'shutdown')
      await stepProcessor.run()

      expect(stepProcessor.processAction).toHaveBeenCalledTimes(5)
      expect(stepProcessor.shutdown).toHaveBeenCalledTimes(1)
    })
  })
})
