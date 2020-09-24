<script lang="ts">
import { defineComponent, toRefs, provide, PropType, watch, h } from 'vue'
import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import { useBreakpoint } from '../../utils/useTailwindBreakpoint'
import { PaginationObject } from './types'
import { tableState } from './tableStore'

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Object as PropType<PaginationObject>,
      required: false,
    },
  },
  components: {
    TableHead,
    TableRow,
    TablePagination,
  },
  setup(props, { slots, emit }) {
    const { data, pagination } = toRefs(props)
    const { currentBreakpoint } = useBreakpoint()

    provide('data', data)
    provide('currentBreakpoint', currentBreakpoint)
    provide('pagination', pagination)

    function pageChange(value: number) {
      emit('pagechange', value)
    }

    watch(
      () => tableState.currentPage,
      (page) => {
        pageChange(page)
      }
    )

    return () => {
      let slotContent: any = []
      slotContent = [slots.default!()]

      if (props.pagination) {
        let paginationMarkup = h(TablePagination)
        if (slots.pagination) {
          paginationMarkup = h(TablePagination, [slots.pagination!()])
        }

        return h('div', [h('table', { class: 'w-full' }, slotContent), paginationMarkup])
      } else {
        return h('div', [h('table', { class: 'w-full' }, slotContent)])
      }
    }
  },
})
</script>
