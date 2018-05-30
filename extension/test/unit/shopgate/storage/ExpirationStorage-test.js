const sinon = require('sinon')
const { describe, it, beforeEach, afterEach } = require('mocha')

const ExpirationStorage = require('../../../../lib/shopgate/storage/ExpirationStorage')

describe('ExpirationStorage', async () => {
  const sandbox = sinon.createSandbox()
  let pipelineStorageStub
  let storage

  beforeEach(() => {
    pipelineStorageStub = {
      get: sandbox.stub(),
      set: sandbox.stub(),
      del: sandbox.stub()
    }
    storage = new ExpirationStorage(pipelineStorageStub)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  describe('get', async () => {
    it('should call get() on the PipelineStorage', async () => {
      storage.get('fake_key')

      sinon.assert.calledOnce(pipelineStorageStub.get.withArgs('expiration_fake_key'))
    })

    it('should return null if key has expired', async () => {
      pipelineStorageStub.get.returns({
        expirationDate: Date.now() - 1000,
        value: '74-41'
      })
      const actual = await storage.get('fake_key')
      sinon.assert.match(actual, null)
    })

    it('should return value if key still valid', async () => {
      pipelineStorageStub.get.returns({
        expirationDate: Date.now() + 5000,
        value: '74-41'
      })
      const actual = await storage.get('fake_key')
      sinon.assert.match(actual, '74-41')
    })
  })

  describe('set', async () => {
    it('should call set() on the PipelineStorage', async () => {
      storage.set('fake_key', 'fake_value')

      sinon.assert.calledOnce(pipelineStorageStub.set.withArgs('expiration_fake_key', sinon.match.any))
    })
  })

  describe('del', async () => {
    it('should call del() on the PipelineStorage', async () => {
      storage.del('fake_key')

      sinon.assert.calledOnce(pipelineStorageStub.del.withArgs('expiration_fake_key'))
    })
  })

  describe('create', async () => {
    it('should create its own instance', async () => {
      const actual = ExpirationStorage.create(pipelineStorageStub)

      sinon.assert.pass(actual instanceof ExpirationStorage)
    })
  })
})
