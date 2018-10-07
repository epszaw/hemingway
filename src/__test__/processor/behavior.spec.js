const { Processor } = require('src/processor')
const { Reporter } = require('src/reporter')
const shortStory = require('__fixtures__/trees/common_story')

describe('Processor', () => {
  let reporter

  beforeAll(() => {
    jest.setTimeout(30000)
  })

  beforeEach(() => {
    reporter = new Reporter()
  })

  describe('step processing', () => {
    it('common_story.json run (with common operators)', async () => {
      expect.assertions(2)

      const stepProcessor = new Processor({
        step: shortStory,
        reporter,
      })

      jest.spyOn(stepProcessor, 'processAction')
      jest.spyOn(stepProcessor, 'shutdown')
      await stepProcessor.run()

      expect(stepProcessor.processAction).toHaveBeenCalledTimes(5)
      expect(stepProcessor.shutdown).toHaveBeenCalledTimes(1)
    })
  })
})
