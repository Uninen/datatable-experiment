<template>
  <th v-if="isVisible" :class="{ 'cursor-pointer': orderKey }" @click="toggleOrdering">
    <slot />
  </th>
</template>
<script lang="ts">
import { defineComponent, inject, computed, provide, ref } from 'vue'

import { Breakpoint, TableState } from './types'

export default defineComponent({
  props: {
    hiddenBelow: {
      required: false,
      default: Breakpoint.MOBILE,
    },
    orderKey: {
      required: false,
      type: String,
      default: '',
    },
  },
  setup(props) {
    const state = inject('state') as TableState
    const icon = ref('switch-vertical')

    const isVisible = computed(() => {
      if (state.currentBreakpoint.value) {
        return state.currentBreakpoint.value >= props.hiddenBelow
      } else {
        return true
      }
    })

    const iconName = computed(() => {
      if (state.ordering.current.value.startsWith('-')) {
        return 'arrow-down'
      } else if (state.ordering.current.value === '') {
        return 'switch-vertical'
      } else {
        return 'arrow-up'
      }
    })

    function toggleOrdering() {
      switch (state.ordering.current.value) {
        case '':
          state.ordering.current.value = props.orderKey
          icon.value = 'arrow-up'
          break
        case props.orderKey:
          state.ordering.current.value = '-' + props.orderKey
          icon.value = 'arrow-down'
          break
        case '-' + props.orderKey:
          state.ordering.current.value = ''
          icon.value = 'switch-vertical'
          break
      }
    }

    provide('iconName', icon)

    return {
      iconName,
      currentOrdering: state.ordering.current,
      toggleOrdering,
      isVisible,
    }
  },
})
</script>
