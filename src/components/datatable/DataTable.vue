<script lang="ts">
import { defineComponent, provide, PropType, watchEffect, h, ref, watch, toRaw } from 'vue'

import mitt from 'mitt'

import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import DataTableFilter from './DataTableFilter.vue'
import { useBreakpoint } from '../../utils/useTailwindBreakpoint'
import { PaginationObject, TableMode, TableConfig } from './types'
import { AxiosInstance } from 'axios'
import { paginate, generateID, formatDate } from './utils'

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: false,
    },
    axiosInstance: {
      type: Function as PropType<AxiosInstance>,
      required: false,
    },
    dataModel: {
      type: String,
      required: false,
    },
    searchTerm: {
      type: String,
      required: false,
    },
    itemsPerPage: {
      type: Number,
      required: false,
    },
  },
  components: {
    TableHead,
    TableRow,
    TablePagination,
  },
  setup(props, { slots, attrs }) {
    const initialLoadingDone = ref(false)
    const isFetchingData = ref(false)
    const currentPage = ref(1)
    const currentOrdering = ref('')
    const perPage = ref(25)
    const { currentBreakpoint } = useBreakpoint()
    const data = ref<unknown[]>([])
    const dataCount = ref(0)
    const maxPages = ref(7)
    const pagination = ref<PaginationObject>()
    const url = ref('')
    const searchTerm = ref('')
    let usePagination = true
    let tableId: string
    let mode: TableMode = TableMode.REMOTE

    if (!slots.pagination && !props.itemsPerPage) {
      usePagination = false
    }

    if (props.itemsPerPage && props.itemsPerPage > 0) {
      perPage.value = props.itemsPerPage
    }

    if (props.data) {
      mode = TableMode.LOCAL
    }

    // @ts-expect-error
    if (attrs.id && attrs.id.length > 0) {
      tableId = attrs.id as string
    } else {
      tableId = generateID()
    }

    const tableConf: TableConfig = {
      mode: mode,
      tableId: tableId,
      bus: mitt(),
    }

    function dateFormatter(dateStr: string): string {
      if (currentBreakpoint.value < 2) {
        return formatDate(dateStr, 'YYYY-MM-DD')
      } else {
        return formatDate(dateStr, 'MMMM D, YYYY')
      }
    }

    function prepDataForCurrentPage(): void {
      if (usePagination) {
        // @ts-ignore
        data.value = props.data!.slice(pagination.value.startIndex, pagination.value.endIndex)
      }
    }

    function calculatePagination() {
      if (usePagination) {
        pagination.value = paginate(
          dataCount.value,
          currentPage.value,
          perPage.value,
          maxPages.value
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
      prepDataForCurrentPage()
      isFetchingData.value = false
      initialLoadingDone.value = true
      console.log('local data looks like this: ', toRaw(data))
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
      if (searchTerm.value.length > 0) {
        console.log(`search for "${value}"`)
      } else {
        console.log('clear search')
      }
      currentPage.value = 1
    }

    tableConf.bus.on(`pagechange-${tableConf.tableId}`, (value) => pageChange(value))
    tableConf.bus.on(`ordering-${tableConf.tableId}`, (value) => orderingChange(value))
    tableConf.bus.on(`search-${tableConf.tableId}`, (value) => searchChange(value))

    watchEffect(() => {
      if (currentBreakpoint.value > 3) {
        maxPages.value = 11
      } else if (currentBreakpoint.value > 2) {
        maxPages.value = 7
      } else {
        maxPages.value = 5
      }
      if (initialLoadingDone.value && pagination.value) {
        calculatePagination()
      }
    })

    watch([currentPage, currentOrdering, searchTerm], () => {
      prepareData()
      console.log('Watching [currentPage, currentOrdering, searchTerm]')
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

        console.log('start SLOTS')
        for (const sl in slots) {
          console.log('slot: ', sl)
        }
        console.log('end SLOTS')

        if (!slots.default) {
          slotContent = [h(TableRow)]
          console.log('rendering w/ table row')
        } else {
          slotContent = [slots.default()]
        }

        if (slots.filters) {
          slotContent.push(h(DataTableFilter))
        }

        if (props.itemsPerPage || slots.pagination) {
          let paginationMarkup = h(TablePagination)
          if (slots.pagination) {
            paginationMarkup = h(TablePagination, [slots.pagination!()])
          }
          return h('div', [h('table', { class: 'w-full' }, slotContent), paginationMarkup])
        } else {
          console.log('rendering wo pagination')
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
