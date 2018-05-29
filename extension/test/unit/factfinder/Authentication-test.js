const {FactFinderAuthentication, AUTHENTICATION_TYPE_SIMPLE, AUTHENTICATION_TYPE_EXTENDED} = require('../../../lib/factfinder/Authentication')
const assert = require('assert')
const sinon = require('sinon')
const {describe, it, beforeEach, afterEach} = require('mocha')

describe('FactFinderClientSearchBuilder', function () {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    sandbox.useFakeTimers()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should build a simple authentication', function () {
    const subjectUnderTest = new FactFinderAuthentication('user', 'userpw', AUTHENTICATION_TYPE_SIMPLE, 'FACT-FINDER', 'FACT-FINDER')
    sandbox.useFakeTimers(1270732953523)
    assert.deepStrictEqual(subjectUnderTest.addAuthentication({}),
      {
        username: 'user',
        password: 'd8118f1bb6bd9998031053176a2c4bee'
      })
  })

  it('should build an extended authentication', function () {
    const subjectUnderTest = new FactFinderAuthentication('user', 'userpw', AUTHENTICATION_TYPE_EXTENDED, 'FACT-FINDER', 'FACT-FINDER')
    sandbox.useFakeTimers(1270732953523)
    assert.deepStrictEqual(subjectUnderTest.addAuthentication({}),
      {
        username: 'user',
        timestamp: '1270732953523',
        password: '167539c3e7aba8388eee252f429a4a1a'
      })
  })

  it('should not add authentication parameter when username is missing', function () {
    const subjectUnderTest = new FactFinderAuthentication('', 'userpw', AUTHENTICATION_TYPE_EXTENDED, 'FACT-FINDER', 'FACT-FINDER')
    assert.deepStrictEqual(subjectUnderTest.addAuthentication({}), {})
  })

  it('should not add authentication parameter when password is missing', function () {
    const subjectUnderTest = new FactFinderAuthentication('user', '', AUTHENTICATION_TYPE_EXTENDED, 'FACT-FINDER', 'FACT-FINDER')
    assert.deepStrictEqual(subjectUnderTest.addAuthentication({}), {})
  })
})
