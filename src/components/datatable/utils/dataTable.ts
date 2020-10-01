import { isRef, unref } from 'vue'
import MiniSearch from 'minisearch'

import { TableProps, LocalTableProps } from '../types'
import { formatDate } from './index'

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
  log(message: string, obj: any) {
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
}

export const debug = new DebugLogger()
