interface FactFinderClientSearchFiltersResponse {
  filters: FactFinderClientSearchFilter[]
}

interface FactFinderClientSearchFilter {
  id: string
  label: string
  source: string
  type: string
  values: FactFinderClientSearchFilterValue[]
}

interface FactFinderClientSearchFilterValue {
  id: string
  label: string
  hits: number
}
