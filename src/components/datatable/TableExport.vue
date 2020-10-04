<template>
  <slot
    v-bind="{
      data,
    }"
  ></slot>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue'

import { TableState } from './types'

export default defineComponent({
  setup() {
    const state = inject('state') as TableState

    return {
      data: state.data.current,
    }
  },
})
</script>
