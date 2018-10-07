const chalk = require('chalk')
const { EventEmitter } = require('events')

class Reporter extends EventEmitter {
  constructor(options) {
    super(options)

    this.on('log', this.log)
  }

  log({ type, text }) {
    switch (type) {
      case 'info':
        this.info(text)
        break
      case 'warning':
        this.warning(text)
        break
      case 'error':
        this.error(text)
        break
      default:
        console.log(text)
    }
  }

  info(text) {
    console.warn(chalk.green(text))
  }

  warning(text) {
    console.warn(chalk.yellow(text))
  }

  error(text) {
    console.error(chalk.red(text))
  }
}

module.exports = {
  Reporter,
}
