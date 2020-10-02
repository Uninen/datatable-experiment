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

    const isVisible = computed(() => {
      if (state.currentBreakpoint.value) {
        return state.currentBreakpoint.value >= props.hiddenBelow
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
