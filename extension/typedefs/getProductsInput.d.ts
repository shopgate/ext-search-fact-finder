interface getProductsInput {
  categoryId? : number
  searchPhrase? : string
  filters?: getProductsInputFilter[]
  offset?: number
  limit?: number
  sort?: string
  productIds?: number[]
  skipHighlightLoading?: boolean
  skipLiveshoppingLoading?: boolean
  showInactive?: boolean
  characteristics?: boolean
}

interface getProductsInputFilter {

}
