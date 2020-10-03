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
import { TableMode } from './types'
import { debug } from './utils/dev'

export default defineComponent({
  setup() {
    const state = inject('state') as TableState
    let searchFn

    const searchTerm = ref<string>('')

    function searchTermChange(event: any = undefined) {
      if (event) {
        searchTerm.value = event.target.value
      }
      if (searchTerm.value.length !== 1) {
        state.search.query.value = searchTerm.value
      }
    }

    const search = debounce(
      function () {
        searchTermChange()
      },
      200,
      { maxWait: 500 }
    )

    if (state.mode === TableMode.LOCAL) {
      searchFn = searchTermChange
    } else {
      searchFn = search
    }

    function updateSearchTerm(event: any) {
      debug.run('updateSearchTerm')
      searchTerm.value = event.target.value
    }

    watchEffect(() => {
      if (searchTerm.value.length === 0 || searchTerm.value.length === 2) {
        search.flush()
      }
    })

    return {
      searchTerm,
      search: searchFn,
      updateSearchTerm,
    }
  },
})
</script>
