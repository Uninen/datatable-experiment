import { reactive } from 'vue'
import { TableState, Breakpoint } from './types'

export const state: TableState = reactive({
  isWorking: true,
  currentBreakpoint: Breakpoint.MOBILE,
  data: {
    original: [],
    current: [],
    url: '',
    totalCount: 0,
  },
  features: {
    pagination: false,
    search: false,
  },
  ordering: {
    current: '',
  },
  pagination: {
    perPage: 25,
    maxPaginationPages: 7,
    currentPage: 1,
  },
  search: {
    query: '',
  },
})
