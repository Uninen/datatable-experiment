<script lang="ts">
import { defineComponent, provide, PropType, watchEffect, h, ref, watch } from 'vue'

import mitt from 'mitt'
import MiniSearch from 'minisearch'

import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import TableSearch from './TableSearch.vue'
import { useBreakpoint } from './utils/useTailwindBreakpoint'
import { TableMode, TableConfig, LocalTableProps, RemoteTableProps } from './types'

import { state } from './store'
import { paginate, generateID } from './utils'
import { isLocal, dateFormatter } from './utils/dataTable'

export default defineComponent({
  props: {
    configuration: {
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

    if (isLocal(props.configuration)) {
      mode = TableMode.LOCAL

      searchInstance.value = new MiniSearch({
        fields: ['name', 'username'],
        searchOptions: {
          prefix: true,
          fuzzy: 0.3,
        },
      })
      searchInstance.value.addAll(props.configuration.data)
    } else {
      console.log('config type: ', props.configuration)
    }

    if (!slots.pagination && !props.itemsPerPage) {
      usePagination = false
    }

    if (props.itemsPerPage && props.itemsPerPage > 0) {
      perPage.value = props.itemsPerPage
    }

    // @ts-expect-error
    if (attrs.id && attrs.id.length > 0) {
      tableId = attrs.id as string
    } else {
      tableId = generateID()
    }

    const tableConf: TableConfig = {
      tableId: tableId,
      dataMode: mode,
      bus: mitt(),
    }

    function localSearch() {
      console.log('local search for ', searchTerm.value)
      let newData: any = []
      const results = searchInstance.value!.search(searchTerm.value)
      if (props.data && results.length > 0) {
        for (const resultObj of results) {
          newData.push(
            props.data.find((obj: any) => {
              return obj.id === resultObj.id
            })
          )
        }
        data.value = newData
        dataCount.value = newData.length
        console.log('search results: ', newData.length)
      } else {
        data.value = []
        dataCount.value = 0
      }
      console.log('after search: ', data.value.length)
      calculatePagination()
    }

    function prepLocalDataForCurrentPage(): void {
      let endIndex = 0
      if (searchTerm.value.length > 0) {
        localSearch()
      } else {
        data.value = props.data!
      }

      if (tableConf.mode == TableMode.LOCAL && pagination.value) {
        // @ts-ignore
        console.log('data.value.length before slice: ', data.value.length)
        console.log(
          'pagination start index end index before slice: ',
          pagination.value.startIndex,
          pagination.value.endIndex
        )
        if (data.value.length < perPage.value) {
          endIndex = pagination.value.endIndex + 1
        } else {
          endIndex = pagination.value.endIndex
        }
        data.value = data.value.slice(pagination.value.startIndex, endIndex)
        console.log('data.value.length after slice: ', data.value.length)
      }
    }

    function calculatePagination() {
      if (usePagination) {
        pagination.value = paginate(
          dataCount.value,
          currentPage.value,
          perPage.value,
          maxPaginationPages.value
        )
      }
    }

    function calculateApiUrl() {
      let prefix = ''
      let suffix = ''
      if (searchTerm.value.length > 0) {
        prefix = '/search'
        suffix = `&search=${searchTerm.value}`
      }

      url.value = `${prefix}/${props.dataModel}?page=${currentPage.value}&limit=${perPage.value}`
      if (currentOrdering.value && currentOrdering.value.length > 0) {
        url.value += `&ordering=${currentOrdering.value}`
      }
      url.value += suffix
    }

    function initLocalData(): void {
      console.log('initing local data')
      isFetchingData.value = true
      data.value = props.data!
      dataCount.value = props.data!.length
      calculatePagination()
      prepLocalDataForCurrentPage()
      isFetchingData.value = false
      initialLoadingDone.value = true
      // console.log('local data: ', toRaw(data))
    }

    function queryData(): void {
      console.log('querying remote data')
      isFetchingData.value = true

      props.axiosInstance!.get(url.value).then((response) => {
        data.value = response.data.results
        dataCount.value = response.data.count
        calculatePagination()
        isFetchingData.value = false
        initialLoadingDone.value = true
      })
    }

    function prepareData(): void {
      if (tableConf.mode == TableMode.REMOTE) {
        calculateApiUrl()
        queryData()
      } else {
        initLocalData()
      }
    }

    function pageChange(value: number) {
      currentPage.value = value
    }

    function orderingChange(value: string) {
      currentOrdering.value = value
      console.log('catch ordering change')
    }

    function searchChange(value: string) {
      searchTerm.value = value
      // if (searchTerm.value.length > 0) {
      //   console.log(`search for "${value}"`)
      // } else {
      //   console.log('clear search')
      // }
      currentPage.value = 1
    }

    tableConf.bus.on(`pagechange-${tableConf.tableId}`, (value) => pageChange(value))
    tableConf.bus.on(`ordering-${tableConf.tableId}`, (value) => orderingChange(value))
    tableConf.bus.on(`search-${tableConf.tableId}`, (value) => searchChange(value))

    watchEffect(() => {
      if (currentBreakpoint.value > 3) {
        maxPaginationPages.value = 11
      } else if (currentBreakpoint.value > 2) {
        maxPaginationPages.value = 7
      } else {
        maxPaginationPages.value = 5
      }
      if (initialLoadingDone.value && pagination.value) {
        calculatePagination()
      }
    })

    watch([currentPage, currentOrdering, searchTerm], () => {
      prepareData()
      // console.log('Watching [currentPage, currentOrdering, searchTerm]')
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
