<template>
  <td v-if="isVisible">
    <slot>
      {{ item }}
    </slot>
  </td>
</template>
<script lang="ts">
import { defineComponent, computed, Ref, inject } from 'vue'

import { Breakpoint } from './types'

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
    const currentBreakpoint = inject<Ref<Breakpoint>>('currentBreakpoint')

    const isVisible = computed(() => {
      if (currentBreakpoint?.value) {
        return currentBreakpoint.value >= props.hiddenBelow
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
