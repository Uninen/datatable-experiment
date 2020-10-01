import { Emitter } from 'mitt'
import { AxiosInstance } from 'axios'
import MiniSearch from 'minisearch'

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

export interface TableState {
  isWorking: boolean
  currentBreakpoint: Breakpoint
  data: {
    original: any[]
    current: any[]
    url: string
    totalCount: number
  }
  features: {
    pagination: false
    search: false
  }
  ordering: {
    current: string
  }
  pagination: {
    perPage: number
    maxPaginationPages: number
    currentPage: number
    data?: PaginationObject
  }
  search: {
    searchTerm: string
    searchInstance?: MiniSearch
  }
}

export interface TableConfig {
  readonly tableId: string
  readonly dataMode: TableMode
  bus: Emitter
  state: TableState
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
  dateFormats?: {
    short?: string
    long?: string
  }
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
