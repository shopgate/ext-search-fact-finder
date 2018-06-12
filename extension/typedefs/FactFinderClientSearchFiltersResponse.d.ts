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

interface FactFinderClientSearchFilterType {
  NUMBER: string
  TEXT: string
  CATEGORY_PATH: string
  ATTRIBUTE: string
}


interface FactFinderClientSearchFilterSelectionType {
  MULTISELECT_OR: string
  MULTISELECT_AND: string
  SINGLE_SHOW_UNSELECTED: string
  SINGLE_HIDE_UNSELECTED: string
}

interface FactFinderClientSearchFilterStyle {
  DEFAULT: FactFinderClientSearchFilterStyleObject
  MULTISELECT: FactFinderClientSearchFilterStyleObject
  TREE: FactFinderClientSearchFilterStyleObject
  SLIDER: FactFinderClientSearchFilterStyleObject
}

interface FactFinderClientSearchFilterStyleObject {
  type: FactFinderClientSearchFilterType[]
}
