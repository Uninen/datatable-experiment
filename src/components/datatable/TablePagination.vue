<template>
  <slot
    v-bind="{
      pagination,
      previousPage,
      nextPage,
      hasPreviousPage,
      hasNextPage,
      changePageTo,
      isFetchingData,
      currentPage,
      pageList,
    }"
  ></slot>
</template>
<script lang="ts">
import { defineComponent, computed, inject, ref, watch, isReactive, isRef } from 'vue'
import { debug } from './utils/dev'
import { TableConfig } from './types'
import { TableState } from './types'

export default defineComponent({
  emits: ['pagechange'],
  setup(_, { emit }) {
    const currentPage = ref(1)
    const state = inject('state') as TableState
    const pagination = state.pagination.data!
    const isFetchingData = state.isWorking
    const tableConf = inject('tableConf') as TableConfig

    const changePage = inject('changePage')

    const { previousPage, nextPage, hasPreviousPage, hasNextPage, pageList } = inject('pagination')

    function changePageTo(page: number) {
      currentPage.value = page
      // state.current.page = page
      // emit('pagechange', page)
      // tableConf.bus.emit(`pagechange-${tableConf.tableId}`, page)
      changePage(page)
    }

    // watch(pagination, () => {
    //   debug.log('pagination changed in TablePagination', pagination)
    // })

    // TODO: convert to proxyRefs

    // return () => {
    //   if (slots.default) {
    //     return slots.default({
    //       pagination,
    //       previousPage,
    //       nextPage,
    //       hasPreviousPage,
    //       hasNextPage,
    //       changePageTo,
    //       isFetchingData,
    //       currentPage,
    //       shrunkPageList,
    //     })
    //   }
    // }

    return {
      pagination,
      changePageTo,
      isFetchingData,
      currentPage,
      previousPage,
      nextPage,
      hasPreviousPage,
      hasNextPage,
      pageList,
    }
  },
})
</script>
