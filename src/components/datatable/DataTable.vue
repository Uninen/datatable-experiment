<template>
  <div>
    <table class="w-full">
      <slot />
    </table>
    <slot v-if="pagination" name="pagination">
      <table-pagination />
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, provide, PropType, watch } from 'vue'
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
  setup(props, { emit }) {
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

    return {
      pageChange,
    }
  },
})
</script>
