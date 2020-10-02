<template>
  <slot
    v-bind="{
      updateSearchTerm,
      searchTerm,
      search,
    }"
  ></slot>
</template>
<script lang="ts">
import { defineComponent, inject, ref, watchEffect } from 'vue'
import { TableState } from './types'
import { debounce } from 'lodash-es'

export default defineComponent({
  setup() {
    const state = inject('state') as TableState

    const searchTerm = ref<string>('')

    function searchTermChange() {
      if (searchTerm.value.length !== 1) {
        state.search.query.value = searchTerm.value
      }
    }

    function updateSearchTerm(event: any) {
      searchTerm.value = event.target.value
    }

    const search = debounce(
      function () {
        searchTermChange()
      },
      300,
      { maxWait: 500 }
    )

    watchEffect(() => {
      if (searchTerm.value.length === 0 || searchTerm.value.length === 2) {
        search.flush()
      }
    })

    return {
      searchTerm,
      search,
      updateSearchTerm,
    }
  },
})
</script>
