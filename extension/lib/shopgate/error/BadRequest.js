class ShopgateErrorBadRequest {
  /**
   * @param displayMessage
   */
  constructor (displayMessage) {
    this.code = 'EUNKNOWN'
    this.message = 'Bad request'
    this.displayMessage = displayMessage
  }
}

module.exports = ShopgateErrorBadRequest
