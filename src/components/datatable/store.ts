import { watch, computed, ref } from 'vue'
import { clone } from 'lodash-es'

import { debug } from './utils/dev'
import { paginate, sortByKey, useDateFormat } from './utils'

import { TableState, TableMode } from './types'

export const createStore = () => {
  const state: TableState = {
    mode: TableMode.LOCAL,
    isWorking: ref(true),
    initialLoadingDone: ref(false),
    currentBreakpoint: ref(1),
    data: {
      master: [],
      original: [],
      current: ref([]),
      search: ref([]),
      totalCount: ref(0),
    },
    features: {
      pagination: ref(false),
      search: ref(false),
    },
    ordering: {
      current: ref(''),
    },
    pagination: {
      current: ref(1),
      perPage: ref(25),
      maxPaginationPages: ref(7),
      // data: { PaginationObject }
    },
    search: {
      query: ref(''),
      // instance: { MiniSearch }
    },
  }

  const changePage = (value: number): void => {
    debug.run('changePage', value)
    state.pagination.current.value = value
  }

  const applyLocalOrdering = (): void => {
    debug.run('applyLocalOrdering')
    if (state.ordering.current.value === '') {
      debug.log('Resetting ordering')
      state.data.original = clone(state.data.master)
      state.data.current.value = clone(state.data.master)
    } else {
      state.data.original.sort(sortByKey(state.ordering.current.value))
      state.data.search.value.sort(sortByKey(state.ordering.current.value))
    }
  }

  const changeOrdering = (value: string): void => {
    debug.run('changeOrdering', value)
    state.ordering.current.value = value
    applyLocalOrdering()
  }

  const changeSearch = (value: string): void => {
    state.search.query.value = value
    state.pagination.current.value = 1
  }

  const buildPagination = (): void => {
    debug.run('buildPagination')
    if (state.pagination.data) {
      state.pagination.data.value = paginate(
        state.data.totalCount.value,
        state.pagination.current.value,
        state.pagination.perPage.value,
        state.pagination.maxPaginationPages.value
      )
    } else {
      state.pagination.data = ref(
        paginate(
          state.data.totalCount.value,
          state.pagination.current.value,
          state.pagination.perPage.value,
          state.pagination.maxPaginationPages.value
        )
      )
    }
  }

  const buildUrl = (): void => {
    debug.run('buildUrl')
    let prefix = ''
    let suffix = ''
    if (state.search.query.value.length > 0) {
      prefix = '/search'
      suffix = `&search=${state.search.query}`
    }

    state.remote!.url.value = `${prefix}/${state.remote!.dataModel.value}?page=${
      state.pagination.current.value
    }&limit=${state.pagination.perPage}`
    if (state.ordering.current.value.length > 0) {
      state.remote!.url.value += `&ordering=${state.ordering.current.value}`
    }
    state.remote!.url.value += suffix
  }

  const localSearch = (): void => {
    debug.run('local search for ', state.search.query.value)
    let newData: any = []
    const results = state.search.instance!.search(state.search.query.value)
    if (results.length > 0) {
      for (const resultObj of results) {
        newData.push(
          state.data.original.find((obj: any) => {
            return obj.id === resultObj.id
          })
        )
      }
      state.data.search.value = newData
      state.data.totalCount.value = newData.length
      debug.log('search results: ', newData.length)
    } else {
      state.data.search.value = []
      state.data.totalCount.value = 0
    }
    debug.log('after search: ', state.data.current.value.length)
  }

  const localPagination = (): void => {
    let endIndex = 0
    debug.run('localPagination')

    if (state.search.query.value.length > 0) {
      localSearch()
    }

    if (state.features.pagination) {
      buildPagination()
      applyLocalOrdering()

      if (state.data.totalCount.value < state.pagination.perPage.value) {
        endIndex = state.pagination.data!.value.endIndex + 1
      } else {
        endIndex = state.pagination.data!.value.endIndex
      }

      debug.log('data.value.length before slice: ', state.data.current.value.length)

      if (state.search.query.value.length > 0) {
        state.data.current.value = state.data.search.value.slice(
          state.pagination.data!.value.startIndex,
          endIndex
        )
      } else {
        state.data.current.value = state.data.original.slice(
          state.pagination.data!.value.startIndex,
          endIndex
        )
      }

      debug.log('data.value.length after slice: ', state.data.current.value.length)
      // debug.log('state.data.current.value: ', state.data.current)
    }
  }

  const refreshRemoteData = (): void => {
    debug.run('queryData')
    buildUrl()

    // isFetchingData.value = true

    // props.axiosInstance!.get(url.value).then((response) => {
    //   data.value = response.data.results
    //   dataCount.value = response.data.count
    //   buildPagination()
    //   isFetchingData.value = false
    //   initialLoadingDone.value = true
    // })
  }

  const refreshData = (): void => {
    debug.run('refreshData')
    state.isWorking.value = true

    localPagination()

    state.isWorking.value = false
    state.initialLoadingDone.value = true
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

  const hasPreviousPage = computed(() => {
    return state.pagination.current.value > 1
  })

  const hasNextPage = computed(() => {
    if (state.pagination.data) {
      return state.pagination.current.value < state.pagination.data.value.totalPages
    } else {
      return false
    }
  })

  const previousPageNum = computed(() => {
    return state.pagination.current.value - 1
  })

  const nextPageNum = computed(() => {
    return state.pagination.current.value + 1
  })

  const pageList = computed(() => {
    if (state.pagination.data) {
      return state.pagination.data.value.pages
    } else {
      return false
    }
  })

  const dateFormatter = (dateStr: string) => {
    return useDateFormat(state.currentBreakpoint.value, dateStr)
  }

  watch(state.search.query, () => {
    debug.run('watch state.search.query')
    if (state.search.query.value.length === 0) {
      debug.log('Resetting data.')
      state.data.current.value = state.data.original
      state.data.totalCount.value = state.data.current.value.length
    }
    refreshData()
  })

  watch(state.ordering.current, () => {
    debug.run('watch state.ordering.current')
    applyLocalOrdering()
    refreshData()
  })

  watch(state.pagination.current, () => {
    debug.run('watch state.pagination.current')
    refreshData()
  })

  return {
    state,
    changePage,
    changeOrdering,
    changeSearch,
    buildUrl,
    buildPagination,
    refreshData,
    dateFormatter,
    pagination: {
      hasPreviousPage,
      hasNextPage,
      previousPageNum,
      nextPageNum,
      pageList,
    },
  }
}
