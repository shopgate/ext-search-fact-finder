const EXPIRATION_KEY = 'expiration_'

class ExpirationStorage {
  /**
   * @param {PipelineStorage} pipelineStorage
   */
  constructor (pipelineStorage) {
    this.pipelineStorage = pipelineStorage
  }

  /**
   * @param {PipelineStorage} pipelineStorage
   * @returns {ExpirationStorage}
   */
  static create (pipelineStorage) {
    return new ExpirationStorage(pipelineStorage)
  }

  /**
   * @param {string} key
   * @return {Promise<*>}
   */
  async get (key) {
    const storageData = await this.pipelineStorage.get(EXPIRATION_KEY + key)
    if (!storageData || storageData.expirationDate <= Date.now()) {
      return null
    }

    return storageData.value
  }

  /**
   * @param {string} key
   * @param {Object} value
   * @param {number} expirationInSeconds
   * @return {Promise<*>}
   */
  async set (key, value, expirationInSeconds = 1800) {
    return this.pipelineStorage.set(EXPIRATION_KEY + key, {
      expires: Date.now() + expirationInSeconds * 1000,
      value: value
    })
  }

  /**
   * @param {string} key
   * @return {Promise<void>}
   */
  async del (key) {
    return this.pipelineStorage.del(EXPIRATION_KEY + key)
  }
}

module.exports = ExpirationStorage
