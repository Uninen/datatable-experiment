<template>
  <td v-if="isVisible" class="p-2">
    <slot>
      {{ item }}
    </slot>
  </td>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

import { Breakpoint } from './types'
import { store } from './tableStore'

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
    const currentBreakpoint = store.state.currentBreakpoint

    const isVisible = computed(() => {
      return currentBreakpoint >= props.hiddenBelow
    })

    return {
      isVisible,
    }
  },
})
</script>
