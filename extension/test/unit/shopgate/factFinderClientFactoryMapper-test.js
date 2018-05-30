const sinon = require('sinon')
const { describe, it, beforeEach, afterEach } = require('mocha')

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

  it('should create public client when there are no auth parameters', async () => {
    factFinderClientFactoryMapper({})
    sinon.assert.calledOnce(publicClientStub)
  })

  it('should create client with simple auth', async () => {
    factFinderClientFactoryMapper({ authenticationType: 'simple' })
    sinon.assert.calledOnce(clientWithSimpleAuthStub)
  })

  it('should create a client with extended stub', async () => {
    factFinderClientFactoryMapper({ authenticationType: 'extended' })
    sinon.assert.calledOnce(clientWithExtendedAuthStub)
  })
})
