import MiniSearch from 'minisearch'

import { TableProps, LocalTableProps, Breakpoint } from '../types'
import { formatDate } from './index'
import { debug } from './dev'

export function isLocal(prop: TableProps): prop is LocalTableProps {
  return prop.mode === 'local'
}

export function useDateFormat(breakpoint: Breakpoint, dateStr: string): string {
  if (breakpoint < 2) {
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
