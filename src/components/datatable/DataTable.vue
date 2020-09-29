<script lang="ts">
import { defineComponent, provide, PropType, watchEffect, h, ref } from 'vue'

import mitt from 'mitt'

import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import DataTableFilter from './DataTableFilter.vue'
import { useBreakpoint } from '../../utils/useTailwindBreakpoint'
import { PaginationObject } from './types'
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
    const bus = mitt()
    const url = ref('')
    const searchTerm = ref('')
    let tableId: string = ''

    if (props.itemsPerPage && props.itemsPerPage > 0) {
      perPage.value = props.itemsPerPage
    }

    // @ts-ignore
    if (attrs.id && attrs.id.length > 0) {
      tableId = attrs.id as string
    } else {
      tableId = generateID()
    }
    function dateFormatter(dateStr: string): string {
      if (currentBreakpoint.value < 2) {
        return formatDate(dateStr, 'YYYY-MM-DD')
      } else {
        return formatDate(dateStr, 'MMMM D, YYYY')
      }
    }

    function calculatePagination() {
      pagination.value = paginate(dataCount.value, currentPage.value, perPage.value, maxPages.value)
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
      data.value = props.data!
      dataCount.value = props.data!.length
      calculatePagination()
    }

    function queryData(): void {
      if (props.axiosInstance) {
        isFetchingData.value = true

        props.axiosInstance!.get(url.value).then((response) => {
          data.value = response.data.results
          dataCount.value = response.data.count
          calculatePagination()
          isFetchingData.value = false
          initialLoadingDone.value = true
        })
      } else {
        initialLoadingDone.value = true
      }
    }

    function pageChange(value: number) {
      currentPage.value = value
    }

    function orderingChange(value: string) {
      currentOrdering.value = value
    }
    bus.on(`ordering-${tableId}`, (value) => orderingChange(value))

    function searchChange(value: string) {
      searchTerm.value = value
      if (searchTerm.value.length > 0) {
        console.log(`search for "${value}"`)
      } else {
        console.log('clear search')
      }
      currentPage.value = 1
    }
    bus.on(`search-${tableId}`, (value) => searchChange(value))

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

    watchEffect(() => {
      calculateApiUrl()
      queryData()
      // console.log('Watching effect of calculateApiUrl + queryData')
    })

    if (props.data) {
      initLocalData()
      initialLoadingDone.value = true
    }

    provide('data', data)
    provide('bus', bus)
    provide('dateFormatter', dateFormatter)
    provide('tableId', tableId)
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
          slotContent.push(h(DataTableFilter))
        }

        if (props.itemsPerPage || props.axiosInstance) {
          let paginationMarkup = h(TablePagination, {
            onPagechange: (value: number) => pageChange(value),
          })
          if (slots.pagination) {
            paginationMarkup = h(
              TablePagination,
              { onPagechange: (value: number) => pageChange(value) },
              [slots.pagination!()]
            )
          }
          return h('div', [h('table', { class: 'w-full' }, slotContent), paginationMarkup])
        } else {
          return h('div', [h('table', { class: 'w-full' }, slotContent)])
        }
      } else {
        return h('div', slots.loader!())
      }
    }
  },
})
</script>
