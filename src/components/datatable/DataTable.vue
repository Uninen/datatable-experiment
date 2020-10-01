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
import {
  isLocal,
  dateFormatter,
  useLocalSearch,
  ConfigurationError,
  warn,
  debug,
  buildPagination,
  buildUrl,
  changePage,
  changeOrdering,
  changeSearch,
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

    function localSearch(): void {
      debug.run('local search for ', state.search.query)
      // let newData: any = []
      // const results = searchInstance.value!.search(searchTerm.value)
      // if (props.data && results.length > 0) {
      //   for (const resultObj of results) {
      //     newData.push(
      //       props.data.find((obj: any) => {
      //         return obj.id === resultObj.id
      //       })
      //     )
      //   }
      //   data.value = newData
      //   dataCount.value = newData.length
      //   console.log('search results: ', newData.length)
      // } else {
      //   data.value = []
      //   dataCount.value = 0
      // }
      // console.log('after search: ', data.value.length)
      buildPagination()
    }

    function prepLocalDataForCurrentPage(): void {
      debug.run('prepLocalDataForCurrentPage')
      // let endIndex = 0
      // if (searchTerm.value.length > 0) {
      //   localSearch()
      // } else {
      //   data.value = props.data!
      // }

      // if (tableConf.mode == TableMode.LOCAL && pagination.value) {
      //   // @ts-ignore
      //   console.log('data.value.length before slice: ', data.value.length)
      //   console.log(
      //     'pagination start index end index before slice: ',
      //     pagination.value.startIndex,
      //     pagination.value.endIndex
      //   )
      //   if (data.value.length < perPage.value) {
      //     endIndex = pagination.value.endIndex + 1
      //   } else {
      //     endIndex = pagination.value.endIndex
      //   }
      //   data.value = data.value.slice(pagination.value.startIndex, endIndex)
      //   console.log('data.value.length after slice: ', data.value.length)
      // }
    }

    function initLocalData(): void {
      debug.run('initLocalData')
      // isFetchingData.value = true
      // data.value = props.data!
      // dataCount.value = props.data!.length
      // buildPagination()
      // prepLocalDataForCurrentPage()
      // isFetchingData.value = false
      // initialLoadingDone.value = true
      // console.log('local data: ', toRaw(data))
    }

    function queryData(): void {
      debug.run('queryData')

      // isFetchingData.value = true

      // props.axiosInstance!.get(url.value).then((response) => {
      //   data.value = response.data.results
      //   dataCount.value = response.data.count
      //   buildPagination()
      //   isFetchingData.value = false
      //   initialLoadingDone.value = true
      // })
    }

    function prepareData(): void {
      debug.run('prepareData')
      if (isLocal(props.config)) {
        buildUrl()
        queryData()
      } else {
        initLocalData()
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

    watch([currentPage, currentOrdering, searchTerm], () => {
      prepareData()
      debug.log('Watching [currentPage, currentOrdering, searchTerm]')
    })
    prepareData()

    provide('data', data)
    provide('tableConf', tableConf)
    provide('dateFormatter', dateFormatter)
    provide('pagination', pagination)
    provide('isFetchingData', isFetchingData)
    provide('currentBreakpoint', currentBreakpoint)

    return () => {
      if (initialLoadingDone.value) {
        let slotContent: any = []

        if (!slots.default) {
          slotContent = [h(TableRow)]
        } else {
          slotContent = [slots.default()]
        }

        if (slots.search) {
          slotContent.push(h(TableSearch, slots.search))
        }

        if (props.itemsPerPage || slots.pagination) {
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
