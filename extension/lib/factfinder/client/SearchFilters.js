'use strict'
const urlencode = require('urlencode')
const needle = require('needle')
const { DEFAULT_ENCODING } = require('./Encoding')
const FactFinderClientError = require('./errors/FactFinderClientError')
const FactFinderServerError = require('./errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('./errors/FactFinderInvalidResponseError')

const ENDPOINT = '/Search.ff'
const URL = require('url').URL

/** @type FactFinderClientSearchFilterType */
const filterType = {
  NUMBER: 'number',
  TEXT: 'text',
  CATEGORY_PATH: 'categoryPath',
  ATTRIBUTE: 'attribute'
}

/** @type FactFinderClientSearchFilterSelectionType */
const filterSelectionType = {
  MULTISELECT_OR: 'multiSelectOr',
  MULTISELECT_AND: 'multiSelectAnd',
  SINGLE_SHOW_UNSELECTED: 'singleShowUnselected',
  SINGLE_HIDE_UNSELECTED: 'singleHideUnselected'
}

/** @type FactFinderClientSearchFilterStyle */
const filterStyle = {
  DEFAULT: {
    type: [ filterType.ATTRIBUTE, filterType.TEXT ]
  },
  MULTISELECT: {
    type: [ filterType.TEXT, filterType.NUMBER ]
  },
  TREE: {
    type: [ filterType.CATEGORY_PATH ]
  },
  SLIDER: {
    type: []
  }
}

class FactFinderClientSearchFilters {
  /**
   * @param {string} baseUri
   * @param {string} encoding
   */
  constructor (baseUri, encoding) {
    this._baseUri = baseUri
    this._encoding = encoding
  }

  /**
   * @returns {string}
   */
  get url () {
    return this._baseUri + ENDPOINT
  }

  /**
   * @param {FactFinderClientSearchRequest} inputSearchRequest
   * @returns {Promise<FactFinderClientSearchFilter[]>}
   */
  async execute (inputSearchRequest) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    const url = new URL(this.url)
    if (this._encoding !== DEFAULT_ENCODING) {
      searchRequest.query = urlencode(searchRequest.query, this._encoding)
    }

    url.searchParams.append('format', 'json')
    url.searchParams.append('version', '7.3')

    Object.keys(searchRequest)
      .filter(parameter => parameter !== 'filters')
      .forEach(parameter => url.searchParams.append(parameter, searchRequest[parameter]))

    for (const filter of searchRequest.filters) {
      url.searchParams.append(`filter${filter.name}`, this._getFilterValue(filter.values))
    }

    const response = await needle('get', url.toString(), {
      open_timeout: 5000,
      response_timeout: 5000,
      read_timeout: 10000
    })

    if (response.statusCode >= 500) {
      throw new FactFinderServerError(response.statusCode)
    }

    if (response.statusCode >= 400) {
      throw new FactFinderClientError(response.statusCode)
    }

    if (!response.body || !response.body.searchResult || !response.body.searchResult.records) {
      throw new FactFinderInvalidResponseError()
    }

    if (!response.body.searchResult.groups) {
      return []
    }

    const filters = []

    response.body.searchResult.groups.forEach(group => {
      const firstElementWithFieldName = group.elements.find(element => element.associatedFieldName !== undefined)
      if (!firstElementWithFieldName) {
        return
      }

      filters.push({
        associatedFieldName: firstElementWithFieldName.associatedFieldName,
        name: group.name,
        filterStyle: group.filterStyle,
        elements: group.elements
      })
    })

    return filters
  }

  /**
   * @param {any} value
   * @returns {string}
   * @private
   */
  _getFilterValue (value) {
    if (Array.isArray(value)) {
      return value.join('~~~')
    }

    return value
  }
}

module.exports = {
  FactFinderClientSearchFilters,
  filterStyle,
  filterType,
  filterSelectionType
}
