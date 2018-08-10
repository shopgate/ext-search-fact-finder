class ShopgateErrorBadRequest {
  /**
   * @param displayMessage
   */
  constructor (displayMessage) {
    this.code = 'EBADREQUEST'
    this.message = 'Bad request'
    this.displayMessage = displayMessage
  }
}

module.exports = ShopgateErrorBadRequest
