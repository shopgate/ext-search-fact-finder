interface FactFinderClientSearchRequest extends FactFinderClientAuthorisedRequest {
  query: string
  channel?: string
  version?: string
  filters?: FactFinderClientSearchRequestFilter[]
}

interface FactFinderClientSearchRequestFilter {
  name: string,
  values: any[]
}
