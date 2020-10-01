import { Ref } from 'vue'
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
  mode: TableMode
  isWorking: boolean
  initialLoadingDone: boolean
  currentBreakpoint: Breakpoint | Ref<Breakpoint>
  data: {
    original: any[]
    current: any[]
    totalCount: number
  }
  remote?: {
    url: string
    dataModel: string
  }
  current: {
    page: number
  }
  features: {
    pagination: boolean
    search: boolean
  }
  ordering: {
    current: string
  }
  pagination: {
    perPage: number
    maxPaginationPages: number
    data?: PaginationObject
  }
  search: {
    query: string
    instance?: MiniSearch
  }
}

export interface TableConfig {
  readonly tableId: string
  readonly dataMode: TableMode
  bus: Emitter
  state: TableState
  search?: {
    fields?: string[]
    options?: object
  }
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
