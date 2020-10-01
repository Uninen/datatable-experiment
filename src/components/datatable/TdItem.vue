<template>
  <td v-if="isVisible">
    <slot>
      {{ item }}
    </slot>
  </td>
</template>
<script lang="ts">
import { defineComponent, computed, inject } from 'vue'

import { Breakpoint, TableState } from './types'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: false,
    },
    hiddenBelow: {
      required: false,
      default: Breakpoint.MOBILE,
    },
  },
  setup(props) {
    const state = inject('state') as TableState
    const currentBreakpoint = state.currentBreakpoint.value

    const isVisible = computed(() => {
      if (currentBreakpoint) {
        return currentBreakpoint >= props.hiddenBelow
      } else {
        return true
      }
    })

    return {
      isVisible,
    }
  },
})
</script>
