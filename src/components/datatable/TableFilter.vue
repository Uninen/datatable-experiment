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
import { TableConfig } from './types'
import { debounce } from 'lodash-es'

export default defineComponent({
  setup() {
    const tableConf = inject('tableConf') as TableConfig

    const searchTerm = ref<string>('')

    function searchTermChange() {
      console.log('searchterm changed to: ', searchTerm.value)
      if (searchTerm.value.length !== 1) {
        console.log('emitting search')
        tableConf.bus.emit(`search-${tableConf.tableId}`, searchTerm.value)
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
