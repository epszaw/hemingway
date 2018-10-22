const {
  get,
  toLower,
  isEmpty,
  isNil,
  assign,
  capitalize,
} = require('lodash/fp')
const puppeteer = require('puppeteer')
const { expect } = require('chai')
const { ProcessorError } = require('../utils/error')
const { CommonParser } = require('../parser')

class Processor {
  constructor({ story, headless, args }) {
    if (!story) {
      throw new Error('You can not create processor without step tree!')
    }

    this.headless = headless
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

  /**
   * Opens given url in initialized browser
   * Next actions works in opened page context
   * @param {Array<String>} args
   * @param {String} modifier
   * @returns {Promise<void>}
   */
  async open(args, modifier) {
    const [url] = args

    await this._page.goto(url)
  }

  /**
   * Waits appearing element with given selector in the DOM of opened page
   * @param {Array<String>} args
   * @param {String} modifier
   * @returns {Promise<void>}
   */
  async wait(args, modifier) {
    const [selector] = args

    await this._page.waitFor(selector)
  }

  /**
   * Stops test on given time period in seconds
   * @param {Array<String>} args
   * @param {String} modifier
   * @returns {Promise<void>}
   */
  sleep(args, modifier) {
    const [time] = args

    return new Promise((resolve, reject) => setTimeout(resolve, time))
  }

  /**
   * Finds elements by given selector
   * If founds multiple elements – save array of elements to processor cache
   * If founds one element – save element object to processor cache
   * If not founds any elements – save null to processor cache
   * @param {Array<String>} args
   * @param {String} modifier
   * @returns {Promise<Object>}
   */
  async find(args, modifier) {
    const [selector] = args

    return this._page
      .waitFor(selector, {
        timeout: 10000,
      })
      .then(() => this._page.$$(selector))
      .then(res => {
        if (res && res.length === 1) {
          this._cache = res[0]
        } else {
          this._cache = res
        }
      })
  }

  /**
   * Saves current processor cache to state object for next interations with it
   * Other operators can access it by given key
   * @example
   * FIND "#something" AS "foo" // Saves element to state by "foo" key
   * TAKE "foo" TYPE "hello"    // Takes element from state and type "hello"
   * @param {Array<String>} args
   * @param {String} modifier
   * @returns {Promise<Object>}
   */
  as(args, modifier) {
    const [name] = args

    if (this._cache) {
      this._state = assign(this._state, {
        [name]: this._cache,
      })
    }
  }

  /**
   * Takes property from processor cache by given key
   * If property doesn't exist – throws error
   * @example
   * FIND "#something" AS "foo" // Saves element to state by "foo" key
   * TAKE "foo" TYPE "hello"    // Takes element from state and type "hello"
   * @example
   * TAKE "bar" TYPE "hello"    // Will throw error and terminate processor
   * @param {Array<String>} args
   * @param {*} modifier
   * @returs {Promise<void>}
   */
  take(args, modifier) {
    const [name] = args
    const target = get(name, this._state)

    if (!target) {
      throw new Error(`there is no ${name} variable in the step scope`)
    }

    this._cache = target
  }

  /**
   * Emulate click event on element from processor cache
   * @example
   * FIND "#something" CLICK
   * @param {Array<String>} args
   * @param {String} modifier
   * @returns {Promise<Object>}
   */
  async click(args, modifier) {
    await this._cache.click()
  }

  /**
   * Type given text to element from processor cache
   * Supports keyboard keys like "Enter", "Ctrl" etc.
   * @example
   * FIND "#something" TYPE "Hello world!{Enter}" // Will type "Hello world!" and press Enter key
   * @param {*} args
   * @param {*} modifier
   * @returns {Promise<void>}
   */
  async type(args, modifier) {
    const [text] = args
    const parsedText = CommonParser.parseInputText(text)

    for (const { type, value } of parsedText) {
      if (type === 'key') {
        await this._cache.press(capitalize(value))
      } else {
        await this._cache.type(value)
      }
    }
  }

  contain(args, modifier) {
    const [match] = args

    expect(this._cache).to.contain(match)
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

  async init() {
    this._browser = await puppeteer.launch({
      args: this.args,
      headless: this.headless,
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
        this.contain(args, modifier)
        break
      case 'type':
        await this.type(args, modifier)
        break
      case 'sleep':
        await this.sleep(args, modifier)
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
