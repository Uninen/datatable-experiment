import { reactive, computed } from 'vue'
import { PaginationObject, Breakpoint } from './types'
import { paginate } from './utils'

interface StateObject {
  objectList: any[]
  objectCount: number
  currentPage: number
  perPage: number
  pagination: PaginationObject
  currentBreakpoint: Breakpoint
}

export const store = {
  state: reactive({
    objectList: [],
    objectCount: 0,
    currentPage: 1,
    perPage: 20,
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
      startPage: 0,
      endPage: 0,
      startIndex: 0,
      endIndex: 0,
      pages: [],
    },
    currentBreakpoint: Breakpoint.MOBILE,
  }),

  calculatePagination() {
    this.state.pagination = paginate(
      this.state.objectCount,
      this.state.currentPage,
      this.state.perPage
    )
    console.log('Pagination calculated.')
  },

  computed: {
    hasNextPage: computed((state = this.state) => {
      return state.pagination.currentPage < state.pagination.totalPages
    }),

    nextPage: computed(() => {
      return this.state.pagination.value.currentPage + 1
    }),

    hasPreviousPage: computed(() => {
      return this.state.pagination.currentPage > 1
    }),

    previousPage: computed(() => {
      return this.state.pagination.value.currentPage - 1
    }),
  },
}
