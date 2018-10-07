const { Runner } = require('src/runner')
const multipleStories = require('__fixtures__/trees/multiple_stories')

describe('Runner', () => {
  let runner

  beforeEach(() => {
    runner = new Runner()
  })

  it('should process all stories from instance', async () => {
    runner.findStories = jest.fn().mockResolvedValueOnce(multipleStories)

    await runner.run()
  })

  // it('should notify about epmty stories', () => {
  //   console.log(runner)
  // })
})
