const { greenBright, yellowBright, underline } = require('chalk').default
const center = require('center-align')
const { join, pipe } = require('lodash/fp')

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

  console.info(
    pipe(
      join('\n'),
      greenBright,
      center
    )(lines)
  )
}

const unsupportedOperator = name => {
  const lines = [
    '\n',
    `Operator "${name}" not supported yet and this story will be skipped`,
    'Feel free to request new features here:',
    underline('https://github.com/lamartire/hemingway'),
    '\n',
  ]

  console.info(
    pipe(
      join('\n'),
      yellowBright,
      center
    )(lines)
  )
}

module.exports = {
  earlyVersion,
  unsupportedOperator,
}
