class ProcessorError extends Error {
  constructor({ message, def }) {
    super(message)
    this.def = def
  }
}

module.exports = {
  ProcessorError,
}
