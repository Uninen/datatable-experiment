import { isRef, unref } from 'vue'
import MiniSearch from 'minisearch'

import { TableProps, LocalTableProps } from '../types'
import { formatDate, paginate } from './index'

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

export class ConfigurationError extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = ConfigurationError.name
  }
}

export function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(message + ". This warning doesn't show in production.")
  }
}

class DebugLogger {
  log(message: string, obj: any = undefined) {
    if (process.env.NODE_ENV === 'debug') {
      message = '[DataTable] ' + message
      if (obj) {
        if (isRef(obj)) {
          message += ' (ref): '
          obj = unref(obj)
        }
        console.log(message, obj)
      } else {
        console.log(message)
      }
    }
  }

  success(message: string, obj: any = undefined) {
    this.log('✅ ' + message, obj)
  }

  run(message: string, obj: any = undefined) {
    this.log('🚀 ' + message, obj)
  }
}

export const debug = new DebugLogger()

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
