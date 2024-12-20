import * as Logger from 'bunyan'

interface PipelineContext {
  config: PipelineConfiguration
  log: Logger
  storage: PipelineStorageContainer
  tracedRequest (): Object
}

interface PipelineStorage {
  get (key: string) : Promise<string | number | Object>

  set (key: string, value: string | number | Object) : Promise

  del (key: string) : Promise
}

interface PipelineStorageContainer {
  user: PipelineStorage
  device: PipelineStorage
  extension: PipelineStorage
}

interface PipelineConfiguration {
  baseUri: string
  username?: string
  password?: string
  authenticationType?: string
  authenticationPrefix?: string
  authenticationPostfix?: string
  channel: string
  encoding: string,
  uidTemplate: string
  sortPriceName: string
  priceSliderId: string
}
