const {
  assign,
  isEmpty,
  reject,
  map,
  trim,
  last,
  slice,
  concat,
  get,
  reduce,
} = require('lodash/fp')
const { unsupportedOperator } = require('../notifications')

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
  'SLEEP',
  'CLICK',
]

/**
 * Regexes for all methods
 */
const operatorsRegex = /^[A-Z]+$/
const modifierRegex = /(NOT)/
const titleRegex = /^#\s/
const keyboardKeyRegex = /({[A-Z+]+})/gim
const actionsSplittingRegex = /("[^"]+"|[\w]+)/

/**
 * Parser error
 * Need for passing type of error and following payload for more informative console output
 */
class ParserError extends Error {
  constructor({ message, type, payload }) {
    super(message)

    // TODO: add type as ENUM
    this.type = type
    this.payload = payload
  }
}

/**
 * Stories parser with static methods
 */
class StoryParser {
  static appendModifier(acc, atom) {
    return assign(acc)({
      commands: concat(acc.commands, {
        name: null,
        modifier: atom,
        args: [],
      }),
    })
  }

  static appendOperatorToModifier(acc, atom) {
    return assign(acc)({
      commands: concat(
        slice(0, acc.commands.length - 1, acc.commands),
        assign(last(acc.commands), {
          name: atom,
        })
      ),
    })
  }

  static appendOperator(acc, atom) {
    return assign(acc)({
      commands: concat(acc.commands, {
        name: atom,
        modifier: null,
        args: [],
      }),
    })
  }

  static appendArguments(acc, atom) {
    const lastCommand = last(acc.commands)

    return assign(acc)({
      commands: concat(
        slice(0, acc.commands.length - 1, acc.commands),
        assign(lastCommand, {
          args: concat(lastCommand.args, atom.replace(/"/g, '')),
        })
      ),
    })
  }

  static parseAction(rawAction) {
    const atoms = reject(word => isEmpty(word) || /^\s$/.test(word))(
      rawAction.split(actionsSplittingRegex)
    )
    const trimmedAtoms = map(trim)(atoms)

    return trimmedAtoms.reduce(
      (acc, atom) => {
        const isOperator = operatorsRegex.test(atom)
        const isModifier = isOperator && modifierRegex.test(atom)
        const lastCommand = last(acc.commands)

        if (isModifier) {
          return this.appendModifier(acc, atom)
        } else if (isOperator && lastCommand && !get('name', lastCommand)) {
          return this.appendOperatorToModifier(acc, atom)
        } else if (isOperator && allowedCommandsList.includes(atom)) {
          return this.appendOperator(acc, atom)
        } else if (isOperator && !allowedCommandsList.includes(atom)) {
          throw new ParserError({
            message: `Operator ${atom} is not supported yet!`,
            // TODO: make map with types and handle them
            type: 'unsupported_operator',
            payload: atom,
          })
        }

        return this.appendArguments(acc, atom)
      },
      {
        def: rawAction,
        commands: [],
      }
    )
  }

  static parseStory(rawStory) {
    const lines = reject(isEmpty)(rawStory.split('\n'))
    const parsedStory = lines.reduce(
      (acc, line) => {
        if (titleRegex.test(line) && !acc.name) {
          return assign(acc)({
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
    // const signedStories = this.signStories(rawStories)

    return reduce((acc, { filename, source }) => {
      // ! Refactor this moment. Move nested stories processing into method
      const splittedStories = source.split(/\n[-]{3}\n{2}/)
      const signedStories = this.signStories(filename, splittedStories)
      const parsedStories = reduce((parsedAcc, story) => {
        try {
          const parsedStory = this.parseStory(story)

          return concat(parsedAcc, parsedStory)
        } catch (err) {
          if (err.type === 'unsupported_operator') {
            unsupportedOperator(err.payload, filename)
          }

          return parsedAcc
        }
      }, [])(signedStories)

      return concat(acc, parsedStories)
    }, [])(rawStories)
  }

  static signStories(filename, rawStories) {
    return reduce((acc, rawStory) => {
      if (titleRegex.test(rawStory)) {
        return acc.concat(rawStory)
      }

      return concat(acc, `# ${filename}\n\n${rawStory}`)
    }, [])(rawStories)
  }
}

/**
 * Parser for common cases like parsing text with keyboard keys etc.
 * ? Can be used globally in all application
 */
class CommonParser {
  static parseInputText(text) {
    return text
      .split(keyboardKeyRegex)
      .filter(word => !isEmpty(word))
      .map(word => {
        if (keyboardKeyRegex.test(word)) {
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
  ParserError,
  StoryParser,
  CommonParser,
}
