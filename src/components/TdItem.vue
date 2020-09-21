<template>
  <td v-if="isVisible" class="p-2">
    <slot>
      {{ item }}
    </slot>
  </td>
</template>
<script lang="ts">
import { defineComponent, computed, Ref, inject, watchEffect } from 'vue'

import { breakpoint } from '../types'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: false,
    },
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
