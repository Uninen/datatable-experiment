<template>
  <slot
    v-bind="{
      hasPreviousPage,
      changePageTo,
      previousPage,
      isFetchingData,
      pagination,
      hasNextPage,
      nextPage,
      shrunkPageList,
      currentPage,
    }"
  ></slot>
</template>
<script lang="ts">
import { defineComponent, computed, inject, Ref, ref } from 'vue'
import { Emitter } from 'mitt'
import { PaginationObject } from './types'

export default defineComponent({
  emits: ['pagechange'],
  setup(_, { emit, attrs }) {
    const currentPage = ref(1)
    const pagination = inject('pagination') as Ref<PaginationObject>
    const isFetchingData = inject('isFetchingData') as Ref<boolean>
    const bus = inject('bus') as Emitter
    const tableId = inject('tableId') as string

    function changePageTo(page: number) {
      currentPage.value = page
      emit('pagechange', page)
      bus.emit(`pagechange-${tableId}`, page)
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
      attrs,
    }
  },
})
</script>
