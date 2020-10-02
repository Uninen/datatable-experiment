import { reactive, watchEffect, watch, computed, ref } from 'vue'
import { clone } from 'lodash-es'

import { debug } from './utils/dev'
import { paginate } from './utils'

import { TableState, TableMode } from './types'

export const createStore = () => {
  const state: TableState = {
    mode: TableMode.LOCAL,
    isWorking: ref(true),
    initialLoadingDone: ref(false),
    currentBreakpoint: ref(1),
    data: {
      original: [],
      current: [],
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
    },
    search: {
      query: ref(''),
    },
  }

  const changePage = (value: number): void => {
    debug.run('changePage', value)
    state.pagination.current.value = value
  }

  const changeOrdering = (value: string): void => {
    debug.run('changeOrdering', value)
    state.ordering.current.value = value
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

  const localPagination = (): void => {
    let endIndex = 0
    debug.run('localPagination')

    if (state.search.query.value.length > 0) {
      localSearch()
    }

    if (state.features.pagination) {
      buildPagination()

      if (state.data.totalCount < state.pagination.perPage) {
        endIndex = state.pagination.data!.value.endIndex + 1
      } else {
        endIndex = state.pagination.data!.value.endIndex
      }
      // debug.log('state.pagination.data!.value: ', state.pagination.data!.value)
      // debug.log('state.pagination.data!.value.endIndex: ', state.pagination.data!.value.endIndex)
      // debug.log('state.data.current.value: ', state.data.current)
      // debug.log('data.value.length before slice: ', state.data.current.length)
      state.data.current = state.data.original.slice(
        state.pagination.data!.value.startIndex,
        endIndex
      )
      // debug.log('data.value.length after slice: ', state.data.current.length)
      // debug.log('state.data.current.value: ', state.data.current)
    }
  }

  const refreshLocalData = (): void => {
    debug.run('refreshLocalData')
    state.isWorking.value = true

    localPagination()

    state.isWorking.value = false
    state.initialLoadingDone.value = true
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

  function doPagination() {
    if (state.mode === TableMode.LOCAL) {
      localPagination()
    } else {
      refreshLocalData()
    }
  }

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

  const currentPage = computed(() => {
    return state.pagination.current.value
  })

  const pageList = computed(() => {
    if (state.pagination.data) {
      return state.pagination.data.value.pages
    } else {
      return false
    }
  })

  watch([() => state.ordering.current.value, () => state.search.query.value], () => {
    debug.run('watch [currentPage, currentOrdering, searchTerm]')
    refreshLocalData()
  })

  watch(state.pagination.current, () => {
    debug.run('watch currentPage')
    refreshLocalData()
  })

  return {
    state,
    changePage,
    changeOrdering,
    changeSearch,
    buildUrl,
    buildPagination,
    refreshLocalData,
    pagination: {
      hasPreviousPage,
      hasNextPage,
      previousPageNum,
      nextPageNum,
      pageList,
    },
  }
}
