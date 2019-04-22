const {
  greenBright,
  yellowBright,
  redBright,
  underline,
} = require('chalk').default
const center = require('center-align')
const { join, pipe, identity } = require('lodash/fp')

const centeredMessageFromLines = (lines, color = identity) =>
  pipe(
    join('\n'),
    color,
    center
  )(lines)

const earlyVersion = () => {
  const lines = [
    '\n',
    'Thank you for installing Hemingway! 🙌',
    'This is an early version and it may contains some problems.',
    'If you have any issue, feel free to open issues here:',
    underline('https://github.com/lamartire/hemingway'),
    'Have a nice day and pleasure with browser testing! ❤️',
    '\n',
  ]

  console.info(centeredMessageFromLines(lines, greenBright))
}

const unsupportedOperator = (operator, story) => {
  const lines = [
    '\n',
    `Operator "${operator}" not supported yet and story "${story}" will be skipped`,
    'Feel free to request new features here:',
    underline('https://github.com/lamartire/hemingway'),
    '\n',
  ]

  console.info(centeredMessageFromLines(lines, yellowBright))
}

const storiesNotFound = path => {
  const linesForDir = [
    '\n',
    'There is no stories folder! ️☝️',
    'Create "stories" folder with some stories and try again!',
    '\n',
  ]
  const linesForFile = [
    '\n',
    `There is no file by given path "${path}"! ☝️`,
    'Enter other pass and try again!',
    '\n',
  ]

  if (path) {
    console.warn(centeredMessageFromLines(linesForFile, redBright))
  } else {
    console.warn(centeredMessageFromLines(linesForDir, redBright))
  }
}

module.exports = {
  earlyVersion,
  unsupportedOperator,
  storiesNotFound,
}
