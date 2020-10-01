import MiniSearch from 'minisearch'

import { TableProps, LocalTableProps } from '../types'
import { formatDate, paginate } from './index'
import { debug } from './dev'

import { state } from '../store'

export function isLocal(prop: TableProps): prop is LocalTableProps {
  return prop.mode === 'local'
}

export function dateFormatter(dateStr: string): string {
  if (state.currentBreakpoint < 2) {
    return formatDate(dateStr, 'YYYY-MM-DD')
  } else {
    return formatDate(dateStr, 'MMMM D, YYYY')
  }
}

export function useLocalSearch(
  data: any,
  fields: string[],
  options: any = {
    prefix: true,
    fuzzy: 0.3,
  }
) {
  const searchOptions = {
    fields,
    searchOptions: options,
  }
  const instance = new MiniSearch(searchOptions)
  instance.addAll(data)
  return instance
}

export function buildPagination(): void {
  debug.log('buildPagination')
  state.pagination.data = paginate(
    state.data.totalCount,
    state.pagination.currentPage,
    state.pagination.perPage,
    state.pagination.maxPaginationPages
  )
}

export function buildUrl(): void {
  debug.run('buildUrl')
  // let prefix = ''
  // let suffix = ''
  // if (searchTerm.value.length > 0) {
  //   prefix = '/search'
  //   suffix = `&search=${searchTerm.value}`
  // }

  // url.value = `${prefix}/${props.dataModel}?page=${currentPage.value}&limit=${perPage.value}`
  // if (currentOrdering.value && currentOrdering.value.length > 0) {
  //   url.value += `&ordering=${currentOrdering.value}`
  // }
  // url.value += suffix
}

export function changePage(value: number): void {
  debug.run('changePage')
  state.pagination.currentPage = value
}

export function changeOrdering(value: string): void {
  debug.run('changeOrdering')
  state.ordering.current = value
}

export function changeSearch(value: string): void {
  state.search.query = value
  state.pagination.currentPage = 1
}

export function localSearch(): void {
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
  buildPagination()
}

export function refreshRemoteData(): void {
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

export function refreshLocalData(): void {
  debug.run('refreshLocalData')
  // isFetchingData.value = true
  // data.value = props.data!
  // dataCount.value = props.data!.length
  // buildPagination()
  // prepLocalDataForCurrentPage()
  // isFetchingData.value = false
  // initialLoadingDone.value = true
  // console.log('local data: ', toRaw(data))
}

function prepLocalDataForCurrentPage(): void {
  debug.run('prepLocalDataForCurrentPage')
  // let endIndex = 0
  // if (searchTerm.value.length > 0) {
  //   localSearch()
  // } else {
  //   data.value = props.data!
  // }

  // if (tableConf.mode == TableMode.LOCAL && pagination.value) {
  //   // @ts-ignore
  //   console.log('data.value.length before slice: ', data.value.length)
  //   console.log(
  //     'pagination start index end index before slice: ',
  //     pagination.value.startIndex,
  //     pagination.value.endIndex
  //   )
  //   if (data.value.length < perPage.value) {
  //     endIndex = pagination.value.endIndex + 1
  //   } else {
  //     endIndex = pagination.value.endIndex
  //   }
  //   data.value = data.value.slice(pagination.value.startIndex, endIndex)
  //   console.log('data.value.length after slice: ', data.value.length)
  // }
}
