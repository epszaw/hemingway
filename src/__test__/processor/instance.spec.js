const { Processor } = require('src/processor')

describe('Processor instance', () => {
  describe('instance creating', () => {
    it('should throws if step is not given', () => {
      expect(() => {
        /* eslint-disable-next-line */
        new Processor()
      }).toThrow()
    })
  })
})
