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
import { defineComponent, inject, ref } from 'vue'
import { debug } from './utils/dev'
import { TableState } from './types'

export default defineComponent({
  emits: ['pagechange'],
  setup() {
    const currentPage = ref(1)
    const state = inject('state') as TableState
    const isFetchingData = state.isWorking

    // @ts-ignore
    const { previousPage, nextPage, hasPreviousPage, hasNextPage, pageList } = inject('pagination')

    function changePageTo(page: number) {
      debug.run('changePageTo', page)
      currentPage.value = page
      state.pagination.current.value = page
    }

    // debug.log('pageList', pageList.value)

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
      pagination: state.pagination.data!,
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
