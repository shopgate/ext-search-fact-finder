const sinon = require('sinon')

const FactFinderClient = require('../../../lib/factfinder/Client')
const factFinderClientFactoryMapper = require('../../../lib/shopgate/factFinderClientFactoryMapper')

describe('factFinderClientFactoryMapper', async () => {
  const sandbox = sinon.createSandbox()
  let publicClientStub, clientWithSimpleAuthStub, clientWithExtendedAuthStub

  beforeEach(() => {
    publicClientStub = sandbox.stub(FactFinderClient, 'createPublicClient')
    clientWithSimpleAuthStub = sandbox.stub(FactFinderClient, 'createClientWithSimpleAuthentication')
    clientWithExtendedAuthStub = sandbox.stub(FactFinderClient, 'createClientWithExtendedAuthentication')
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  describe('public fact-finder client', async () => {
    it('should create public client when there are no auth parameters', async () => {
      factFinderClientFactoryMapper({})
      sinon.assert.calledOnce(publicClientStub)
    })

    it('should create public client when auth parameters are not supported', async () => {
      factFinderClientFactoryMapper({ authenticationType: 'invalid' })
      sinon.assert.calledOnce(publicClientStub)
    })

    it('should create public client according to config', async () => {
      factFinderClientFactoryMapper({ baseUri: 'http://www.shopgate.com', encoding: 'utf8' })
      sinon.assert.calledOnce(publicClientStub.withArgs('http://www.shopgate.com', 'utf8'))
    })
  })

  describe('simple auth fact-finder client', async () => {
    it('should create client with simple auth', async () => {
      factFinderClientFactoryMapper({ authenticationType: 'simple' })

      sinon.assert.calledOnce(clientWithSimpleAuthStub)
    })
    it('should create client with simple auth according to config', async () => {
      factFinderClientFactoryMapper({
        baseUri: 'http://www.shopgate.com',
        authenticationType: 'simple',
        username: 'john',
        password: 'simple',
        encoding: 'utf8'})

      sinon.assert.calledOnce(clientWithSimpleAuthStub)
      sinon.assert.calledWith(clientWithSimpleAuthStub, 'http://www.shopgate.com', 'john', 'simple', 'utf8')
    })
  })

  describe('extended auth fact-finder client', async () => {
    it('should create a client with extended auth', async () => {
      factFinderClientFactoryMapper({authenticationType: 'extended'})
      sinon.assert.calledOnce(clientWithExtendedAuthStub)
    })
    it('should create a client with extended auth according to config', async () => {
      factFinderClientFactoryMapper({
        baseUri: 'http://www.shopgate.com',
        authenticationType: 'extended',
        username: 'john',
        password: 'simple',
        encoding: 'utf8',
        authenticationPrefix: 'factfinder',
        authenticationPostfix: 'factfinder'
      })
      sinon.assert.calledOnce(clientWithExtendedAuthStub)
      sinon.assert.calledWith(clientWithExtendedAuthStub, {
        baseUri: 'http://www.shopgate.com',
        username: 'john',
        password: 'simple',
        encoding: 'utf8',
        authenticationPrefix: 'factfinder',
        authenticationPostfix: 'factfinder'
      })
    })
  })
})
