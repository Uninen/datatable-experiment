<template>
  <t-icon :name="iconName" class="inline-block w-4 h-4 ml-2" />
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue'
import { TableState } from './types'

export default defineComponent({
  setup() {
    const state = inject('state') as TableState
    const iconName = inject('iconName')

    return {
      iconName,
      currentOrdering: state.ordering.current,
    }
  },
})
</script>
