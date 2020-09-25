<script lang="ts">
import { defineComponent, provide, PropType, watchEffect, h, ref, toRaw } from 'vue'
import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import { useBreakpoint } from '../../utils/useTailwindBreakpoint'
import { PaginationObject } from './types'
import { AxiosInstance } from 'axios'
import { paginate } from './utils'

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
    const perPage = ref(15)
    const { currentBreakpoint } = useBreakpoint()
    const data = ref<unknown[]>([])
    const dataCount = ref(0)
    const pagination = ref<PaginationObject>()

    if (props.pagination) {
      pagination.value = props.pagination
    }

    function queryData(page: number, limit: number, ordering?: string): void {
      if (props.axiosInstance) {
        console.log('queryData', page)
        isFetchingData.value = true
        let url = `/artists?page=${page}&limit=${limit}`
        if (ordering) {
          url += `&ordering=${ordering}`
        }
        props.axiosInstance!.get(url).then((response) => {
          data.value = response.data.results
          dataCount.value = response.data.count
          pagination.value = paginate(dataCount.value, page, limit)
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

    watchEffect(() => {
      queryData(currentPage.value, perPage.value)
    })

    if (props.data) {
      provide('data', props.data)
      initialLoadingDone.value = true
    } else {
      provide('data', data)
    }
    provide('pagination', pagination)
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
