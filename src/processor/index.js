const { get, toLower, isEmpty, isNil } = require('lodash/fp')
const puppeteer = require('puppeteer')
const { expect } = require('chai')
const { ProcessorError } = require('../utils/error')
const { CommonParser } = require('../parser')

class Processor extends CommonParser {
  constructor({ story, debug, args }) {
    super()

    if (!story) {
      throw new Error('You can not create processor without step tree!')
    }

    this.debug = debug
    this.story = story
    this.args = args || ['--no-sandbox', '--disable-setuid-sandbox']

    /**
     * Private properties
     */
    this._browser = null
    this._page = null
    this._cache = null
    this._state = {}
  }

  /**
   * Operators handlers def
   */

  async open(args, modifier) {
    const [url] = args

    await this._page.goto(url)
  }

  async wait(args, modifier) {
    const [selector] = args

    await this._page.waitFor(selector)
  }

  async find(args, modifier) {
    const [selector] = args
    const res = await this._page.$$(selector)

    if (res && res.length === 1) {
      this._cache = res[0]
    } else {
      this._cache = res
    }
  }

  as(args, modifier) {
    const [name] = args

    if (this._cache) {
      Object.assign(this._state, {
        [name]: this._cache,
      })
    }
  }

  take(args, modifier) {
    const [name] = args
    const target = get(name, this._state)

    if (!target) {
      throw new Error(`there is no ${name} variable in the step scope`)
    }

    this._cache = target
  }

  async click(args, modifier) {
    await this._cache.click()
  }

  have(args, modifier) {
    const [key] = args
    const target = get(key, this._cache)

    if (isNil(target)) {
      throw new Error(`there is no ${key} property current target`)
    }

    this._cache = target
  }

  equal(args, modifier) {
    const [value] = args

    if (modifier === 'NOT') {
      expect(this._cache).not.to.equal(value)
    } else {
      expect(this._cache).to.equal(value)
    }
  }

  async contain(args, modifier) {
    const [match] = args

    expect(this._cache).to.contain(match)
  }

  async type(args, modifier) {
    const [text] = args
    const parsedText = this.parseInputText(text)

    for (const { type, value } of parsedText) {
      if (type === 'key') {
        await this._cache.press(value)
      } else {
        await this._cache.type(value)
      }
    }
  }

  async init() {
    this._browser = await puppeteer.launch({
      args: this.args,
      headless: !this.debug,
    })
    this._page = await this._browser.newPage()
  }

  async shutdown() {
    await this._page.close()
    await this._browser.close()
  }

  async run() {
    await this.init()

    for (const action of this.story.actions) {
      await this.processAction(action)

      this._cache = null
    }

    await this.shutdown()
  }

  async processAction(action) {
    if (!isEmpty(action.commands)) {
      for (const command of action.commands) {
        try {
          await this.processCommand(command)
        } catch (err) {
          throw new ProcessorError({
            def: action.def,
            message: err.toString(),
          })
        }
      }
    }
  }

  async processCommand(command) {
    const { name, args, modifier } = command

    switch (toLower(name)) {
      case 'open':
        await this.open(args, modifier)
        break
      case 'wait':
        await this.wait(args, modifier)
        break
      case 'find':
        await this.find(args, modifier)
        break
      case 'as':
        this.as(args, modifier)
        break
      case 'take':
        this.take(args, modifier)
        break
      case 'click':
        await this.click(args, modifier)
        break
      case 'have':
        this.have(args, modifier)
        break
      case 'equal':
        this.equal(args, modifier)
        break
      case 'contain':
        await this.contain(args, modifier)
        break
      case 'type':
        await this.type(args, modifier)
        break
      default:
        // TODO: move to parser
        console.warn(
          [
            `Operator "${name}" not supported yet.`,
            'Feel free to request new features in project repository.',
          ].join('\n')
        )
    }
  }
}

module.exports = {
  Processor,
}
