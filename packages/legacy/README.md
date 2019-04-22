<p align="center">
  <a href="https://github.com/lamartire/hemingway" target="_blank">
    <img width="150"src="https://github.com/lamartire/hemingway/blob/master/public/logo.png?raw=true" />
  </a>
</p>

# Hemingway ✍️

[![Build Status][ci-build]][ci] [![code style: prettier][prettier-image]][prettier] ![zero-configuration]

## Table of contents

- [Idea](#idea)
- [Usage](#usage)
- [Stories writing](#stories-writing)

## Idea

The core idea of this project is a simplification of e2e and bdd "browser-based" testing with
minimalistic API and zero configuraton.

This points must save time on early development stages and give ability to write tests for everyone
– you just need know base stories syntax and html-selectors.

We have a lot of tools like Selenium, WebDriver, Nightwatch and other cool projects, but they needs
a lot of knowledge, like basics in programming on specific language or skills in environment setup.

This project will solve these problems 😌

## Usage

At this time we have only one way to install hemingway and use it – cli.

### Installation

Install package with you favorite `npm` client:

```
npm i --save-dev hemingway
```

Or:

```
yarn add -D hemingway
```

You can install package globally or directly into your project.

_The heart of hemingway is puppeteer and you must have installed Google Chrome browser. Hemingway
does not working without it_!

### CLI

Hemingway is very minimalistic (yet, huh 😅) and has a really few options. Also it can be used
without ones.

`-o, --open` – disable headless mode and opens browser for each test.

```
hemingway -o
```

---

`-s, --story <path>` – runs specific story.

```
hemingway -s path/to/your/story.md
```

## Stories writing

One of the core ideas – simple and declarative syntax. The best example is SQL – you can read your
queries like sentenses and understan it.

Hemingway has sql-like syntax. For example:

```md
OPEN "https://google.com"
FIND "#lst-ib" AS "search-input"
TAKE "search-input" TYPE "Hello{Enter}"
WAIT "#rhscol"
FIND ".bkWMgd" HAVE "length" NOT EQUAL "0"
```

Do you understand what we expect here? I think yes 🙂

### Concepts

Stories have 3 main abstractions – operator, argument and modifier.

Operator – command in UPPERCASE. It is a way for declare actions.

Argument – text between double quotes next for operator. Now, all operators are unary (using one
argument).

Modifier – are special operators withous arguments. They must be placed before operator for
modify operator behavior. Now hemingway has only `NOT` modifier and it is the best example for this
abstraction.

### Flow

All stories using "flow". It is a very simple concept – do something in one line.

For example we have next story line `FIND ".bkWMgd" HAVE "length" NOT EQUAL "0"`. Operators will be
processed in sequence like flow. Lets look at simple graph:

```
FIND ".bkWMgd" -> (result) -> HAVE "length" -> (result) -> NOT(EQUAL "0")
```

Afrer each step we put result to next operator (like pipe-operator in some languages, in particular
Elixir). It's very simple for understanding and for writing test cases.

Stories also have state and you can use it with special operators like `AS` and `TAKE`, but they
don't affect flow concept. For example we can take this case:

```
FIND "#lst-ib" AS "search-input"
TAKE "search-input" TYPE "Hello{Enter}"
```

And lets disassemble it in familiar to us graph:

```
state {}
FIND "#lst-ib" -> (result) AS "search-input"


state {
  'search-input': <Element>
}
TAKE "search-input" -> (result from state) -> TYPE "Hello{Enter}"
```

Each story has its-own state and stories have not access to other story state.

### Operators list

| Operator name | Arguments  | Description                                                                                                                         | Alias |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `OPEN`        | `url`      | Opens page with given url                                                                                                           |       |
| `FIND`        | `selector` | Find element by given selector. Similar to `document.querySelector` and `document.querySelectorAll` bahavior. If found              |       |
| `AS`          | `alias`    | Save result of previous operator to story state with given alias                                                                    |       |
| `TAKE`        | `alias`    | Takes something from story state by given alias                                                                                     |       |
| `TYPE`        | `text`     | Types text into input and input-like elements. Also supports keyboard keys like `Hello world{Enter}`.                               |       |
| `WAIT`        | `selector` | Waits given selector in default for puppeteer timeout (will be configurable in the future)                                          |       |
| `EQUAL`       | `value`    | Compare result of previous operator with given value                                                                                |       |
| `HAVE`        | `property` | Takes property from result of previous operator. For example `FIND ".element" HAVE "length"` will return count of `.element` nodes. |       |
| `SLEEP`       | `time`     | Waits given time (in miliseconds).                                                                                                  |       |
| `CLICK`       |            | Triggers click event on element from result of previous operator.                                                                   |       |

### Modifiers list

| Modifier name | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| `NOT`         | Boolean negative for next operator result. Best example is `EQUAL`. |

[ci]: https://travis-ci.org/lamartire/hemingway
[ci-build]: https://travis-ci.org/lamartire/hemingway.svg?branch=master
[prettier]: https://github.com/prettier/prettier
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[zero-configuration]: https://img.shields.io/badge/zero-configuration-blue.svg
