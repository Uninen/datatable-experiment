<script lang="ts">
import {
  defineComponent,
  provide,
  PropType,
  watchEffect,
  h,
  ref,
  watch,
  isReactive,
  isRef,
} from 'vue'

import mitt from 'mitt'

import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import TableSearch from './TableSearch.vue'
import { useBreakpoint } from './utils/useTailwindBreakpoint'
import { TableMode, TableConfig, LocalTableProps, RemoteTableProps } from './types'

import { createStore } from './store'
import { generateID } from './utils'
import { ConfigurationError, warn, debug } from './utils/dev'
import { isLocal, useDateFormat, useLocalSearch, refreshRemoteData } from './utils/dataTable'

export default defineComponent({
  props: {
    config: {
      type: Object as PropType<LocalTableProps | RemoteTableProps>,
      required: true,
    },
  },
  components: {
    TableHead,
    TableRow,
    TablePagination,
  },
  setup(props, { slots, attrs }) {
    const {
      state,
      changePage,
      changeOrdering,
      changeSearch,
      refreshLocalData,
      pagination,
    } = createStore()

    let tableId: string
    let mode: TableMode = TableMode.REMOTE

    state.currentBreakpoint = useBreakpoint()

    if (attrs.id) {
      tableId = attrs.id as string
    } else {
      tableId = generateID()
    }
    debug.log('tableId set to ', tableId)

    if (slots.pagination) {
      debug.log('Configuring pagination')
      state.features.pagination = true
      if (props.config.itemsPerPage) {
        state.pagination.perPage = props.config.itemsPerPage
      } else {
        warn('DataTable pagination set up but "config.itemsPerPage" is not set')
      }
      debug.success('Pagination configured')
    }

    if (isLocal(props.config)) {
      debug.log('Table in LOCAL mode')
      mode = TableMode.LOCAL

      state.data.original = props.config.data
      state.data.totalCount = props.config.data.length
      debug.log('Storing original data: ', state.data.original)

      if (slots.search) {
        debug.log('Configuring search')
        state.features.search = true
        if (props.config.searchFields) {
          state.search.instance = useLocalSearch(props.config.data, props.config.searchFields)
        } else {
          throw new ConfigurationError('Property "searchFields" is missing from configuration')
        }
        debug.success('Search configured')
      }
    } else {
      debug.log('Table in REMOTE mode')
      mode = TableMode.REMOTE
    }

    const tableConf: TableConfig = {
      tableId: tableId,
      dataMode: mode,
      bus: mitt(),
      state,
    }

    function refreshData(): void {
      if (isLocal(props.config)) {
        refreshLocalData()
      } else {
        refreshRemoteData()
      }
    }

    // tableConf.bus.on(`pagechange-${tableConf.tableId}`, (value) => changePage(value))
    tableConf.bus.on(`ordering-${tableConf.tableId}`, (value) => changeOrdering(value))
    tableConf.bus.on(`search-${tableConf.tableId}`, (value) => changeSearch(value))

    refreshData()

    // console.log('TYPEOF state: ', typeof state)
    console.log('state.currentPage: ', isReactive(state.current))
    console.log('state.pagination: ', isReactive(state.pagination))
    // console.log('state isRef: ', isRef(state))

    provide('state', state)
    provide('tableConf', tableConf)
    provide('dateFormatter', useDateFormat)
    provide('pagination', pagination)
    provide('changePage', changePage)

    return () => {
      if (state.initialLoadingDone) {
        let slotContent: any = []

        if (!slots.default) {
          slotContent = [h(TableRow)]
        } else {
          slotContent = [slots.default()]
        }

        if (state.features.search) {
          slotContent.push(h(TableSearch, slots.search))
        }

        if (state.features.pagination) {
          let paginationMarkup = h(TablePagination)
          if (slots.pagination) {
            paginationMarkup = h(TablePagination, slots.pagination)
          }
          return h('div', [h('table', { class: 'w-full' }, slotContent), paginationMarkup])
        } else {
          return h('div', [h('table', { class: 'w-full' }, slotContent)])
        }
      } else {
        if (slots.loader) {
          return h('div', slots.loader!())
        } else {
          return h('div', 'Loading...')
        }
      }
    }
  },
})
</script>
