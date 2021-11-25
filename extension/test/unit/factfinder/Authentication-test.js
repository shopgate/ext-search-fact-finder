const {FactFinderAuthentication, AUTHENTICATION_TYPE_EXTENDED, AUTHENTICATION_TYPE_SIMPLE} = require('../../../lib/factfinder/Authentication')
const assert = require('assert')
const sinon = require('sinon')
const configs = require('../config')

describe('FactFinderClientSearchBuilder', function () {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should build a simple authentication', function () {
    const subjectUnderTest = new FactFinderAuthentication({
      ...configs.factFinderConfig.auth,
      authenticationType: AUTHENTICATION_TYPE_SIMPLE
    })
    sandbox.useFakeTimers(1270732953523)
    assert.deepStrictEqual(subjectUnderTest.addAuthentication({}),
      {
        username: 'shopgate',
        password: 'd8118f1bb6bd9998031053176a2c4bee'
      })
  })

  it('should build an extended authentication', function () {
    const subjectUnderTest = new FactFinderAuthentication({
      ...configs.factFinderConfig.auth,
      authenticationType: AUTHENTICATION_TYPE_EXTENDED
    })
    sandbox.useFakeTimers(1270732953523)
    assert.deepStrictEqual(subjectUnderTest.addAuthentication({}),
      {
        username: 'shopgate',
        timestamp: '1270732953523',
        password: '167539c3e7aba8388eee252f429a4a1a'
      })
  })

  it('should not add authentication parameter when username is missing', function () {
    const subjectUnderTest = new FactFinderAuthentication({
      ...configs.factFinderConfig.auth,
      authenticationType: AUTHENTICATION_TYPE_EXTENDED,
      user: ''
    })
    assert.deepStrictEqual(subjectUnderTest.addAuthentication({}), {})
  })

  it('should not add authentication parameter when password is missing', function () {
    const subjectUnderTest = new FactFinderAuthentication({
      ...configs.factFinderConfig.auth,
      authenticationType: AUTHENTICATION_TYPE_EXTENDED,
      password: ''
    })
    assert.deepStrictEqual(subjectUnderTest.addAuthentication({}), {})
  })
})
