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
      shrunkPageList,
    }"
  ></slot>
</template>
<script lang="ts">
import { defineComponent, computed, inject, Ref, ref } from 'vue'
import { TableConfig } from './types'
import { PaginationObject } from './types'

export default defineComponent({
  emits: ['pagechange'],
  setup(_, { emit }) {
    const currentPage = ref(1)
    const pagination = inject('pagination') as Ref<PaginationObject>
    const isFetchingData = inject('isFetchingData') as Ref<boolean>
    const tableConf = inject('tableConf') as TableConfig

    function changePageTo(page: number) {
      currentPage.value = page
      emit('pagechange', page)
      tableConf.bus.emit(`pagechange-${tableConf.tableId}`, page)
    }

    const hasPreviousPage = computed(() => {
      return pagination.value.currentPage > 1
    })

    const hasNextPage = computed(() => {
      return pagination.value.currentPage < pagination.value.totalPages
    })

    const previousPage = computed(() => {
      return pagination.value.currentPage - 1
    })

    const nextPage = computed(() => {
      return pagination.value.currentPage + 1
    })

    const shrunkPageList = computed(() => {
      return pagination.value.pages
    })

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
      previousPage,
      nextPage,
      hasPreviousPage,
      hasNextPage,
      changePageTo,
      isFetchingData,
      currentPage,
      shrunkPageList,
    }
  },
})
</script>
