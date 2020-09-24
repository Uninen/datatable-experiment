<script lang="ts">
import { defineComponent, unref, PropType, watch, h, watchEffect, provide } from 'vue'
import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import { useBreakpoint } from '../../utils/useTailwindBreakpoint'
import { store } from './tableStore'
import { TableArrayObject } from './types'

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<TableArrayObject>,
      required: true,
    },
  },
  components: {
    TableHead,
    TableRow,
    TablePagination,
  },
  setup(props, { slots, emit }) {
    const { currentBreakpoint } = useBreakpoint()

    store.state.objectList = props.data.results
    store.state.objectCount = props.data.count
    store.state.currentBreakpoint = unref(currentBreakpoint)
    store.calculatePagination()

    provide('state', store.state)
    provide('objectList', props.data.results)

    function pageChange(value: number) {
      emit('pagechange', value)
    }

    function changePageTo(page: number) {
      store.state.currentPage = page
    }

    watchEffect(() => {
      console.log('dataprop changed', props.data)
    })

    watch(
      () => store.state.currentPage,
      (page) => {
        pageChange(page)
      }
    )

    watch(
      () => store.state.objectList,
      () => {
        console.log('ObjectList changed!')
      }
    )

    return () => {
      if (props.data.count) {
        console.log('rendering table')
        // console.log('datatable store: ')
        // console.log(toRaw(store.state))

        let slotContent: any = []
        slotContent = [slots.default()]

        if (slots.pagination) {
          let paginationMarkup = h(TablePagination)
          if (slots.pagination) {
            paginationMarkup = h(TablePagination, { class: 'bg-black' }, [slots.pagination!()])
          }

          return h('div', [h('table', { class: 'w-full' }, slotContent), paginationMarkup])
        } else {
          return h('div', [h('table', { class: 'w-full' }, slotContent)])
        }
      }
    }
  },
})
</script>
