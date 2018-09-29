import { map, isNull, reject } from 'lodash/fp'

// TODO: case intensive keys
// TODO: refactor this
export function parseInputText(text) {
  const keyRegex = /\{\S+\}/g

  return reject(
    isNull,
    map(word => {
      if (!word) {
        return null
      } else if (keyRegex.test(word)) {
        return {
          type: 'key',
          value: word.replace(/(^\{|\}$)/g, '')
        }
      }

      return {
        type: 'text',
        value: word
      }
    }, text.replace(keyRegex, a => ` ${a} `).split(/\s/))
  )
}
