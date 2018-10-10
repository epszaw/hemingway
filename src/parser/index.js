const {
  assign,
  isEmpty,
  reject,
  map,
  trim,
  last,
  slice,
  concat,
  flatMap,
} = require('lodash/fp')

const allowedCommandsList = [
  'OPEN',
  'FIND',
  'TAKE',
  'TYPE',
  'AS',
  'WAIT',
  'EQUAL',
  'HAVE',
  'NOT',
]
const operatorsRegex = new RegExp(`(${allowedCommandsList.join('|')})`)
const modifierRegex = /(NOT)/

class StoryParser {
  static parseAction(rawAction) {
    const operatorRegex = /[A-Z\s]+/
    const words = reject(isEmpty)(rawAction.split(/("\S+")/))
    const trimmedWords = map(trim)(words)

    return trimmedWords.reduce(
      (acc, word) => {
        const isOperator = operatorRegex.test(word)
        const lastCommand = last(acc.commands)

        if (isOperator && modifierRegex.test(word)) {
          const [modifier, name] = word.split(' ')
          return assign(acc, {
            commands: concat(acc.commands, {
              name,
              modifier,
              args: [],
            }),
          })
        } else if (isOperator && operatorsRegex.test(word)) {
          return assign(acc, {
            commands: concat(acc.commands, {
              name: word,
              args: [],
            }),
          })
        }

        return assign(acc, {
          commands: concat(
            slice(0, acc.commands.length - 1, acc.commands),
            assign(lastCommand, {
              args: concat(lastCommand.args, word.replace(/"/g, '')),
            })
          ),
        })
      },
      {
        def: rawAction,
        commands: [],
      }
    )
  }

  static parseStory(rawStory) {
    const titleRegex = /^#\s/
    const lines = reject(isEmpty, rawStory.split('\n'))
    const parsedStory = lines.reduce(
      (acc, line) => {
        if (titleRegex.test(line) && !acc.name) {
          return assign(acc, {
            name: line.replace(/^#\s/, ''),
          })
        }

        return assign(acc, {
          actions: concat(acc.actions, this.parseAction(line)),
        })
      },
      {
        name: '',
        actions: [],
      }
    )

    return parsedStory
  }

  static parseStories(rawStories) {
    const storiesHeap = flatMap(rawStory => rawStory.split(/\n[-]{3}\n{2}/))(
      rawStories
    )

    return map(rawStory => this.parseStory(rawStory))(storiesHeap)
  }
}

class CommonParser {
  static parseInputText(text) {
    const keyRegex = /({[A-Z+]+})/gim

    return text
      .split(keyRegex)
      .filter(word => !isEmpty(word))
      .map(word => {
        if (keyRegex.test(word)) {
          return {
            type: 'key',
            value: word.replace(/\{|\}/g, '').toLowerCase(),
          }
        }

        return {
          type: 'text',
          value: word,
        }
      })
  }
}

module.exports = {
  StoryParser,
  CommonParser,
}
