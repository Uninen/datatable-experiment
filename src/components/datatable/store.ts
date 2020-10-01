import { reactive, watchEffect, watch } from 'vue'
import { clone } from 'lodash-es'

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
    debug.run('buildPagination')
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

  const localSearch = (): void => {
    debug.run('local search for ', state.search.query)
    // let newData: any = []
    // const results = searchInstance.value!.search(searchTerm.value)
    // if (props.data && results.length > 0) {
    //   for (const resultObj of results) {
    //     newData.push(
    //       props.data.find((obj: any) => {
    //         return obj.id === resultObj.id
    //       })
    //     )
    //   }
    //   data.value = newData
    //   dataCount.value = newData.length
    //   console.log('search results: ', newData.length)
    // } else {
    //   data.value = []
    //   dataCount.value = 0
    // }
    // console.log('after search: ', data.value.length)
  }

  const refreshLocalData = (): void => {
    debug.run('refreshLocalData')
    state.isWorking = true

    let endIndex = 0

    if (state.search.query.length > 0) {
      localSearch()
    } else {
      state.data.current = clone(state.data.original)
      state.data.totalCount = state.data.current.length
    }

    if (state.features.pagination) {
      buildPagination()

      if (state.data.totalCount < state.pagination.perPage) {
        endIndex = state.pagination.data!.endIndex + 1
      } else {
        endIndex = state.pagination.data!.endIndex
      }
      // debug.log('data.value.length before slice: ', state.data.current.length)
      state.data.current = state.data.current.slice(state.pagination.data!.startIndex, endIndex)
      debug.log('data.value.length after slice: ', state.data.current.length)
    }

    state.isWorking = false
    state.initialLoadingDone = true
    debug.success('refreshLocalData done')
  }

  // watchEffect(() => {
  //   if (state.currentBreakpoint > 3) {
  //     state.pagination.maxPaginationPages = 11
  //   } else if (state.currentBreakpoint > 2) {
  //     state.pagination.maxPaginationPages = 7
  //   } else {
  //     state.pagination.maxPaginationPages = 5
  //   }
  //   if (state.initialLoadingDone && state.pagination.data) {
  //     debug.log('state.currentBreakpoint changed to ', state.currentBreakpoint)
  //     buildPagination()
  //   }
  // })

  // watch(
  //   [() => state.pagination.currentPage, () => state.ordering.current, () => state.search.query],
  //   () => {
  //     debug.run('watch [currentPage, currentOrdering, searchTerm]')
  //     refreshData()
  //   }
  // )

  // watch(
  //   () => state.pagination.currentPage,
  //   () => {
  //     debug.run('watch currentPage')
  //     refreshData()
  //   }
  // )

  return {
    state,
    changePage,
    changeOrdering,
    changeSearch,
    buildUrl,
    buildPagination,
    refreshLocalData,
  }
}