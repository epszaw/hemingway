import { Processor } from 'src/processor'
import { EventEmitter } from 'events'

describe('Processor instance', () => {
  describe('instance creating', () => {
    it('throws if reporter is not given', () => {
      expect(() => {
        /* eslint-disable-next-line */
        new Processor()
      }).toThrow()
    })

    it('throws if reporter is not instance of EventEmmiter', () => {
      expect(() => {
        /* eslint-disable-next-line */
        new Processor({})
      }).toThrow()
    })

    it('throws if step is not given', () => {
      expect(() => {
        /* eslint-disable-next-line */
        new Processor(new EventEmitter())
      }).toThrow()
    })
  })
})
