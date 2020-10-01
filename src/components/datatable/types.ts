import { Emitter } from 'mitt'
import { AxiosInstance } from 'axios'

export const enum Breakpoint {
  MOBILE = 1,
  SM,
  MD,
  LG,
  XL,
}

export interface BreakpointMinWidths {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export interface TableArrayObject {
  count: number
  results: object[]
}

export interface BreakpointObject {
  breakpoint: number
  pixels: number
}

export interface PaginationObject {
  totalItems: number
  totalPages: number
  currentPage: number
  startPage: number
  endPage: number
  startIndex: number
  endIndex: number
  pages: number[]
}

export const enum TableMode {
  LOCAL,
  REMOTE,
}

export interface TableConfig {
  readonly mode: TableMode
  readonly tableId: string
  bus: Emitter
}

interface filterListItem {
  type: Boolean | Date
  key: string
}

export interface TableProps {
  mode: string
  itemsPerPage?: number
  searchFields?: string[]
  searchOptions?: object
  filters?: filterListItem[]
}

export interface LocalTableProps extends TableProps {
  mode: 'local'
  data: any[]
}

export interface RemoteTableProps extends TableProps {
  mode: 'remote'
  axiosInstance: AxiosInstance
  dataModel: string
}
