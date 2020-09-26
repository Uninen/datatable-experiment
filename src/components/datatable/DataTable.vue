<script lang="ts">
import { defineComponent, provide, PropType, watchEffect, h, ref, toRaw } from 'vue'

import mitt from 'mitt'

import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import { useBreakpoint } from '../../utils/useTailwindBreakpoint'
import { PaginationObject } from './types'
import { AxiosInstance } from 'axios'
import { paginate, generateID } from './utils'

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: false,
    },
    pagination: {
      type: Object as PropType<PaginationObject>,
      required: false,
    },
    axiosInstance: {
      type: Function as PropType<AxiosInstance>,
      required: false,
    },
    dataUrl: {
      type: String,
      required: false,
    },
  },
  components: {
    TableHead,
    TableRow,
    TablePagination,
  },
  setup(props, { slots }) {
    const initialLoadingDone = ref(false)
    const isFetchingData = ref(false)
    const currentPage = ref(1)
    const currentOrdering = ref('')
    const perPage = ref(15)
    const { currentBreakpoint } = useBreakpoint()
    const data = ref<unknown[]>([])
    const dataCount = ref(0)
    const maxPages = ref(7)
    const pagination = ref<PaginationObject>()
    const bus = mitt()
    const tableId = generateID()

    function calculatePagination(
      totalCount: number,
      currentPage: number,
      limit: number,
      max: number
    ) {
      pagination.value = paginate(totalCount, currentPage, limit, max)
    }

    function queryData(page: number, limit: number, ordering?: string): void {
      if (props.axiosInstance) {
        isFetchingData.value = true
        let url = `/artists?page=${page}&limit=${limit}`
        if (ordering && ordering.length > 0) {
          url += `&ordering=${ordering}`
        }
        props.axiosInstance!.get(url).then((response) => {
          data.value = response.data.results
          dataCount.value = response.data.count
          calculatePagination(dataCount.value, page, limit, maxPages.value)
          isFetchingData.value = false
          initialLoadingDone.value = true
        })
      } else {
        initialLoadingDone.value = true
      }
    }

    if (props.pagination) {
      pagination.value = props.pagination
    }

    function pageChange(value: number) {
      currentPage.value = value
    }

    function orderingChange(value: string) {
      currentOrdering.value = value
    }
    bus.on(`ordering-${tableId}`, (value) => orderingChange(value))

    watchEffect(() => {
      if (currentBreakpoint.value > 3) {
        maxPages.value = 11
      } else if (currentBreakpoint.value > 2) {
        maxPages.value = 7
      } else {
        maxPages.value = 5
      }
      if (initialLoadingDone.value && pagination.value) {
        calculatePagination(
          pagination.value.totalItems,
          currentPage.value,
          perPage.value,
          maxPages.value
        )
      }
    })

    watchEffect(() => {
      queryData(currentPage.value, perPage.value, currentOrdering.value)
    })

    if (props.data) {
      provide('data', props.data)
      initialLoadingDone.value = true
    } else {
      provide('data', data)
    }
    provide('bus', bus)
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

        if (props.pagination || props.axiosInstance) {
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
