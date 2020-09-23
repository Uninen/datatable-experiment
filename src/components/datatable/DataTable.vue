<template>
  <div>
    <table class="w-full">
      <slot />
    </table>
    <slot v-if="pagination" name="pagination">
      <table-pagination @pagechange="pageChange" />
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, provide, PropType } from 'vue'
import TableHead from './TableHead.vue'
import TableRow from './TableRow.vue'
import TablePagination from './TablePagination.vue'
import { useBreakpoint } from '../../utils/useTailwindBreakpoint'
import { PaginationObject } from './types'

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

    return {
      pageChange,
    }
  },
})
</script>
