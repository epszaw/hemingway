const { CommonParser } = require('src/parser')

describe('CommonParser', () => {
  describe('CommonParser – parseInputText', () => {
    it('should parse string and separate it to keyboard entities', () => {
      expect(CommonParser.parseInputText('Hello world!{Enter}')).toEqual([
        {
          type: 'text',
          value: 'Hello world!',
        },
        {
          type: 'key',
          value: 'enter',
        },
      ])
      expect(
        CommonParser.parseInputText(
          'Hello world!{Enter}There are some words{Enter}with{Enter}line{Enter}breaks!{Ctrl+Enter}'
        )
      ).toEqual([
        {
          type: 'text',
          value: 'Hello world!',
        },
        {
          type: 'key',
          value: 'enter',
        },
        {
          type: 'text',
          value: 'There are some words',
        },
        {
          type: 'key',
          value: 'enter',
        },
        {
          type: 'text',
          value: 'with',
        },
        {
          type: 'key',
          value: 'enter',
        },
        {
          type: 'text',
          value: 'line',
        },
        {
          type: 'key',
          value: 'enter',
        },
        {
          type: 'text',
          value: 'breaks!',
        },
        {
          type: 'key',
          value: 'ctrl+enter',
        },
      ])
    })
  })
})
