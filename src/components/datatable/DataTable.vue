<script lang="ts">
import { defineComponent, provide, PropType, watchEffect, h, ref, watch, toRaw } from 'vue'

import mitt from 'mitt'
import MiniSearch from 'minisearch'

import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import TableFilter from './TableFilter.vue'
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
    const searchInstance = ref<MiniSearch>()
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

      searchInstance.value = new MiniSearch({
        fields: ['name', 'username'],
        searchOptions: {
          prefix: true,
          fuzzy: 0.3,
        },
      })
      searchInstance.value.addAll(props.data)
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
        console.log('calculating pagination w/')
        console.log('dataCount.value: ', dataCount.value)
        console.log('currentPage.value: ', currentPage.value)
        console.log('perPage.value: ', perPage.value)
        console.log('maxPages.value: ', maxPages.value)
        pagination.value = paginate(
          dataCount.value,
          currentPage.value,
          perPage.value,
          maxPages.value
        )
        console.log('pagination.totalItems: ', pagination.value.totalItems)
        console.log('pagination.totalPages: ', pagination.value.totalPages)
        console.log('pagination.currentPage: ', pagination.value.currentPage)
        console.log('pagination.startPage: ', pagination.value.startPage)
        console.log('pagination.endPage: ', pagination.value.endPage)
        console.log('pagination.startIndex: ', pagination.value.startIndex)
        console.log('pagination.endIndex: ', pagination.value.endIndex)
        console.log('pagination.pages: ', pagination.value.pages)
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

        if (slots.filters) {
          slotContent.push(h(TableFilter, slots.filters))
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
