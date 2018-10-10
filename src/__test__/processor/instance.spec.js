const { Processor } = require('src/processor')

describe('Processor instance', () => {
  describe('instance creating', () => {
    it('throws if reporter is not given', () => {
      expect(() => {
        /* eslint-disable-next-line */
        new Processor()
      }).toThrow()
    })

    it('throws if step is not given', () => {
      expect(() => {
        /* eslint-disable-next-line */
        new Processor()
      }).toThrow()
    })
  })
})
