const sinon = require('sinon')
const chai = require('chai')

const FactFinderClientFactory = require('../../../lib/shopgate/FactFinderClientFactory')

describe('FactFinderClientFactory', async () => {
  const sandbox = sinon.createSandbox()

  beforeEach(() => {
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  describe('public fact-finder client', async () => {
    it('should create public client when there are no auth parameters', async () => {
      const client = FactFinderClientFactory.create({})
      chai.assert.equal(client._factFinderAuthentication._authenticationType, 'simple')
    })

    it('should create public client when auth parameters are not supported', async () => {
      const client = FactFinderClientFactory.create({ authenticationType: 'invalid' })
      chai.assert.equal(client._factFinderAuthentication._authenticationType, 'simple')
    })

    it('should create public client according to config', async () => {
      const client = FactFinderClientFactory.create({ baseUri: 'http://www.shopgate.com', encoding: 'utf8' })
      chai.assert.equal(client._baseUri, 'http://www.shopgate.com')
      chai.assert.equal(client._encoding, 'utf8')
      chai.assert.equal(client._factFinderAuthentication._authenticationType, 'simple')
    })
  })

  describe('simple auth fact-finder client', async () => {
    it('should create client with simple auth', async () => {
      const client = FactFinderClientFactory.create({ authenticationType: 'simple' })
      chai.assert.equal(client._factFinderAuthentication._authenticationType, 'simple')
    })
    it('should create client with simple auth according to config', async () => {
      let config = {
        baseUri: 'http://www.shopgate.com',
        authenticationType: 'simple',
        user: 'john',
        password: 'secret',
        encoding: 'utf8',
        httpUser: 'httpJohn',
        httpPass: 'httpSecret'
      }
      const client = FactFinderClientFactory.create(config)

      chai.assert.equal(client._baseUri, 'http://www.shopgate.com')
      chai.assert.equal(client._encoding, 'utf8')
      chai.assert.equal(client._factFinderAuthentication._authenticationType, 'simple')
      chai.assert.equal(client._factFinderAuthentication._user, 'john')
      chai.assert.equal(client._factFinderAuthentication._password, 'secret')
      chai.assert.equal(client._httpAuth.user, 'httpJohn')
      chai.assert.equal(client._httpAuth.pass, 'httpSecret')
    })
  })

  describe('extended auth fact-finder client', async () => {
    it('should create a client with extended auth', async () => {
      const client = FactFinderClientFactory.create({authenticationType: 'extended'})
      chai.assert.equal(client._factFinderAuthentication._authenticationType, 'extended')
    })
    it('should create a client with extended auth according to config', async () => {
      let config = {
        baseUri: 'http://www.shopgate.com',
        authenticationType: 'extended',
        user: 'john',
        password: 'secret',
        encoding: 'utf8',
        authenticationPrefix: 'factfinder',
        authenticationPostfix: 'factfinder',
        httpUser: 'httpJohn',
        httpPass: 'httpSecret'
      }
      const client = FactFinderClientFactory.create(config)
      chai.assert.equal(client._factFinderAuthentication._authenticationType, 'extended')
      chai.assert.equal(client._factFinderAuthentication._user, 'john')
      chai.assert.equal(client._factFinderAuthentication._password, 'secret')
      chai.assert.equal(client._httpAuth.user, 'httpJohn')
      chai.assert.equal(client._httpAuth.pass, 'httpSecret')
    })
  })
})
