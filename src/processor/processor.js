const { EventEmitter } = require('events')
const puppeteer = require('puppeteer')
const { get, toLower, isEmpty, isNil } = require('lodash/fp')
const { expect } = require('chai')

const { parseInputText } = require('../parser/text')

class Processor extends EventEmitter {
  constructor({ reporter, step }) {
    super()

    if (!reporter) {
      throw new Error('You can not create processor without reporter!')
    } else if (!(reporter instanceof EventEmitter)) {
      throw new Error('Given reporter is not instance of Reporter class!')
    } else if (!step) {
      throw new Error('You can not create processor without step tree!')
    }

    this.reporter = reporter
    this.step = step

    /**
     * Private properties
     */
    this._browser = null
    this._page = null
    this._cache = null
    this._state = {}
  }

  /**
   * Operators handlers definition
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
    const parsedText = parseInputText(text)

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
      // ? May be pass is from parameters
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: !process.env.DEBUG,
    })
    this._page = await this._browser.newPage()
  }

  async shutdown() {
    await this._page.close()
    await this._browser.close()
  }

  async run() {
    await this.init()

    for (const action of this.step.actions) {
      try {
        await this.processAction(action)
        this._cache = null
        // TODO: emit error with reporter
        // console.log(`PASS – ${action.definition}`)
      } catch (err) {
        // TODO: throw a real semantic errors
        // console.log(`FAIL – ${action.definition}`)
        console.log(err)
        break
      }
    }

    await this.shutdown()
  }

  async processAction(action) {
    if (!isEmpty(action.commands)) {
      for (const command of action.commands) {
        try {
          await this.processCommand(command)
        } catch (err) {
          console.log('Details err', err)
        }
      }
    } else {
      // TODO: print to reporter about it
      // console.log(`SKIP – ${action.definition}`)
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
        console.log(`${name} not supported`)
    }
  }
}

module.exports = {
  Processor,
}
