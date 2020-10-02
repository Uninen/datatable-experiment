<script lang="ts">
import { defineComponent, provide, PropType, h } from 'vue'

import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import TableSearch from './TableSearch.vue'
import { useBreakpoint } from './utils/useTailwindBreakpoint'
import { TableMode, LocalTableProps, RemoteTableProps } from './types'

import { createStore } from './store'
import { generateID, useLocalSearch, isLocal } from './utils'
import { ConfigurationError, warn, debug } from './utils/dev'

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
    const { state, refreshData, pagination, dateFormatter } = createStore()

    let tableId: string
    let mode: TableMode = TableMode.REMOTE

    if (attrs.id) {
      tableId = attrs.id as string
    } else {
      tableId = generateID()
    }
    state.id = tableId
    debug.log('tableId set to ', tableId)

    if (slots.pagination) {
      debug.log('Configuring pagination')
      state.features.pagination.value = true
      if (props.config.itemsPerPage) {
        state.pagination.perPage.value = props.config.itemsPerPage
      } else {
        warn('DataTable pagination set up but "config.itemsPerPage" is not set')
      }
    }

    if (isLocal(props.config)) {
      debug.log('Configuring table in LOCAL mode')
      mode = TableMode.LOCAL

      state.data.master = props.config.data
      state.data.original = props.config.data
      state.data.current.value = props.config.data
      state.data.totalCount.value = props.config.data.length

      debug.log('Storing original data: ', state.data.original)

      if (slots.search) {
        debug.log('Configuring search')
        state.features.search.value = true
        if (props.config.searchFields) {
          state.search.instance = useLocalSearch(props.config.data, props.config.searchFields)
        } else {
          throw new ConfigurationError('Property "searchFields" is missing from configuration')
        }
      }
      debug.success('Local table configured')
    } else {
      debug.log('Configuring table in REMOTE mode')
      mode = TableMode.REMOTE

      if (props.config.dataModel) {
        state.remote.dataModel = props.config.dataModel
      } else {
        throw new ConfigurationError('Property "dataModel" is missing from configuration')
      }
      if (props.config.axiosInstance) {
        state.remote.axiosInstance = props.config.axiosInstance
      } else {
        throw new ConfigurationError('Property "axiosInstance" is missing from configuration')
      }
      debug.success('Remote table configured')
    }
    state.mode = mode
    state.currentBreakpoint = useBreakpoint()

    refreshData()

    provide('state', state)
    provide('dateFormatter', dateFormatter)
    provide('pagination', pagination)

    return () => {
      if (state.initialLoadingDone.value) {
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
