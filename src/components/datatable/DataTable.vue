<script lang="ts">
import { defineComponent, provide, PropType, watchEffect, h, ref, watch } from 'vue'

import mitt from 'mitt'

import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import TableSearch from './TableSearch.vue'
import { useBreakpoint } from './utils/useTailwindBreakpoint'
import { TableMode, TableConfig, LocalTableProps, RemoteTableProps } from './types'

import { state } from './store'
import { generateID } from './utils'
import { ConfigurationError, warn, debug } from './utils/dev'
import {
  isLocal,
  dateFormatter,
  useLocalSearch,
  changePage,
  changeOrdering,
  changeSearch,
  refreshRemoteData,
  refreshLocalData,
} from './utils/dataTable'

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
    state.currentBreakpoint = useBreakpoint()
    const initialLoadingDone = ref(false)

    let tableId: string
    let mode: TableMode = TableMode.REMOTE

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
      debug.run('refreshData')
      if (!isLocal(props.config)) {
        refreshRemoteData()
      } else {
        refreshLocalData()
      }
    }

    tableConf.bus.on(`pagechange-${tableConf.tableId}`, (value) => changePage(value))
    tableConf.bus.on(`ordering-${tableConf.tableId}`, (value) => changeOrdering(value))
    tableConf.bus.on(`search-${tableConf.tableId}`, (value) => changeSearch(value))

    // watchEffect(() => {
    //   if (currentBreakpoint.value > 3) {
    //     maxPaginationPages.value = 11
    //   } else if (currentBreakpoint.value > 2) {
    //     maxPaginationPages.value = 7
    //   } else {
    //     maxPaginationPages.value = 5
    //   }
    //   if (initialLoadingDone.value && pagination.value) {
    //     calculatePagination()
    //   }
    // })

    watch(
      [() => state.pagination.currentPage, () => state.ordering.current, () => state.search.query],
      () => {
        debug.run('watch [currentPage, currentOrdering, searchTerm]')
        refreshData()
      }
    )
    refreshData()

    provide('data', state.data.current)
    provide('tableConf', tableConf)
    provide('dateFormatter', dateFormatter)
    provide('pagination', state.pagination.data)
    provide('isFetchingData', state.isWorking)
    provide('currentBreakpoint', state.currentBreakpoint)

    return () => {
      if (initialLoadingDone.value) {
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
