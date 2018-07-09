const sinon = require('sinon')

const FactFinderClient = require('../../../lib/factfinder/Client')
const FactFinderClientFactory = require('../../../lib/shopgate/FactFinderClientFactory')

describe('factFinderClientFactoryMapper', async () => {
  const sandbox = sinon.createSandbox()
  let publicClientStub, clientWithSimpleAuthStub, clientWithExtendedAuthStub

  beforeEach(() => {
    publicClientStub = sandbox.stub(FactFinderClientFactory, 'createPublicClient')
    clientWithSimpleAuthStub = sandbox.stub(FactFinderClientFactory, 'createClientWithSimpleAuthentication')
    clientWithExtendedAuthStub = sandbox.stub(FactFinderClientFactory, 'createClientWithExtendedAuthentication')
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  describe('public fact-finder client', async () => {
    it('should create public client when there are no auth parameters', async () => {
      FactFinderClientFactory.create({})
      sinon.assert.calledOnce(publicClientStub)
    })

    it('should create public client when auth parameters are not supported', async () => {
      FactFinderClientFactory.create({ authenticationType: 'invalid' })
      sinon.assert.calledOnce(publicClientStub)
    })

    it('should create public client according to config', async () => {
      FactFinderClientFactory.create({ baseUri: 'http://www.shopgate.com', encoding: 'utf8' })
      sinon.assert.calledOnce(publicClientStub.withArgs('http://www.shopgate.com', {}, 'utf8'))
    })
  })

  describe('simple auth fact-finder client', async () => {
    it('should create client with simple auth', async () => {
      FactFinderClientFactory.create({ authenticationType: 'simple' })

      sinon.assert.calledOnce(clientWithSimpleAuthStub)
    })
    it('should create client with simple auth according to config', async () => {
      FactFinderClientFactory.create({
        baseUri: 'http://www.shopgate.com',
        authenticationType: 'simple',
        username: 'john',
        password: 'simple',
        encoding: 'utf8'})

      sinon.assert.calledOnce(clientWithSimpleAuthStub)
      sinon.assert.calledWith(clientWithSimpleAuthStub, 'http://www.shopgate.com', {}, 'john', 'simple', 'utf8')
    })
  })

  describe('extended auth fact-finder client', async () => {
    it('should create a client with extended auth', async () => {
      FactFinderClientFactory.create({authenticationType: 'extended'})
      sinon.assert.calledOnce(clientWithExtendedAuthStub)
    })
    it('should create a client with extended auth according to config', async () => {
      FactFinderClientFactory.create({
        baseUri: 'http://www.shopgate.com',
        authenticationType: 'extended',
        username: 'john',
        password: 'simple',
        encoding: 'utf8',
        authenticationPrefix: 'factfinder',
        authenticationPostfix: 'factfinder'
      })
      sinon.assert.calledOnce(clientWithExtendedAuthStub)
      sinon.assert.calledWith(
        clientWithExtendedAuthStub,
        'http://www.shopgate.com',
        {},
        'john',
        'simple',
        'factfinder',
        'factfinder',
        'utf8'
      )
    })
  })
})
