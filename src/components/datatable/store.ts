import { reactive, watchEffect } from 'vue'
import { debug } from './utils/dev'
import { paginate } from './utils'

import { TableState } from './types'

export const createStore = () => {
  const state: TableState = reactive({
    isWorking: true,
    initialLoadingDone: false,
    currentBreakpoint: 1,
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

  const changePage = (value: number): void => {
    debug.run('changePage')
    state.pagination.currentPage = value
  }

  const changeOrdering = (value: string): void => {
    debug.run('changeOrdering')
    state.ordering.current = value
  }

  const changeSearch = (value: string): void => {
    state.search.query = value
    state.pagination.currentPage = 1
  }

  const buildPagination = (): void => {
    debug.log('buildPagination')
    state.pagination.data = paginate(
      state.data.totalCount,
      state.pagination.currentPage,
      state.pagination.perPage,
      state.pagination.maxPaginationPages
    )
  }

  const buildUrl = (): void => {
    debug.run('buildUrl')
    let prefix = ''
    let suffix = ''
    if (state.search.query.length > 0) {
      prefix = '/search'
      suffix = `&search=${state.search.query}`
    }

    state.remote!.url = `${prefix}/${state.remote!.dataModel}?page=${
      state.pagination.currentPage
    }&limit=${state.pagination.perPage}`
    if (state.ordering.current.length > 0) {
      state.remote!.url += `&ordering=${state.ordering.current}`
    }
    state.remote!.url += suffix
  }

  watchEffect(() => {
    debug.log('state.currentBreakpoint changed to ', state.currentBreakpoint)
    if (state.currentBreakpoint > 3) {
      state.pagination.maxPaginationPages = 11
    } else if (state.currentBreakpoint > 2) {
      state.pagination.maxPaginationPages = 7
    } else {
      state.pagination.maxPaginationPages = 5
    }
    if (state.initialLoadingDone && state.pagination.data) {
      buildPagination()
    }
  })

  return { state, changePage, changeOrdering, changeSearch, buildUrl, buildPagination }
}
