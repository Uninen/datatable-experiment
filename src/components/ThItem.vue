<template>
  <th
    v-if="isVisible"
    class="px-6 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200"
  >
    <slot />
  </th>
</template>
<script lang="ts">
import { defineComponent, inject, watchEffect, Ref, computed } from 'vue'

import { breakpoint } from '../types'

export default defineComponent({
  props: {
    hiddenBelow: {
      required: false,
      default: breakpoint.MOBILE,
    },
  },
  setup(props) {
    const currentBreakpoint = inject<Ref<breakpoint>>('currentBreakpoint')

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
