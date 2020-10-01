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
