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
  isWorking: Ref<boolean>
  initialLoadingDone: Ref<boolean>
  currentBreakpoint: Ref<Breakpoint>
  data: {
    master: any[]
    original: any[]
    current: Ref<any[]>
    search: Ref<any[]>
    totalCount: Ref<number>
  }
  remote?: {
    url: Ref<string>
    dataModel: Ref<string>
  }
  features: {
    pagination: Ref<boolean>
    search: Ref<boolean>
  }
  ordering: {
    current: Ref<string>
  }
  pagination: {
    current: Ref<number>
    perPage: Ref<number>
    maxPaginationPages: Ref<number>
    data?: Ref<PaginationObject>
  }
  search: {
    query: Ref<string>
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
