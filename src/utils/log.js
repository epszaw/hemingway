const { red, green, yellow } = require('chalk')

const error = text => console.error(red(text))

const warning = text => console.warn(yellow(text))

const info = text => console.info(green(text))

module.exports = {
  error,
  warning,
  info,
}
