import { Processor } from 'src/processor'
import { Reporter } from 'src/reporter'
import shortStory from '__fixtures__/trees/short_story'

describe('Processor', () => {
  let reporter

  beforeEach(() => {
    reporter = new Reporter()
  })

  describe('step processing', () => {
    it('short_story run', async () => {
      expect.assertions(2)

      const stepProcessor = new Processor(reporter, shortStory)

      jest.spyOn(stepProcessor, 'processAction')
      jest.spyOn(stepProcessor, 'shutdown')
      await stepProcessor.run()

      expect(stepProcessor.processAction).toHaveBeenCalledTimes(4)
      expect(stepProcessor.shutdown).toHaveBeenCalledTimes(1)
    })
  })
})
