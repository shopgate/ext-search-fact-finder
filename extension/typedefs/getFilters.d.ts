interface getFiltersResponse {
  filters: ShopgateSearchFilter[]
}

interface ShopgateSearchFilter {
  id: string
  label: string
  source: string
  type: string
  values: ShopgateSearchFilterValue[]
}

interface ShopgateSearchFilterValue {
  id: string
  label: string
  hits: number
}

interface getFiltersRequest {
  categoryId?: string
  searchPhrase?: string
  filters?: ShopgateAppliedSearchFilter[]
}

interface ShopgateAppliedSearchFilter {
  label: string
  source: string
  type: string
  values: any[]
}
