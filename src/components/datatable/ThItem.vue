<template>
  <th v-if="isVisible" :class="{ 'cursor-pointer': orderKey }" @click="toggleOrdering">
    <div class="flex items-center">
      <slot />
      <t-icon
        v-if="currentOrdering.length > 0"
        :name="iconName"
        class="inline-block w-4 h-4 ml-2"
      />
    </div>
  </th>
</template>
<script lang="ts">
import { defineComponent, inject, ref, computed } from 'vue'

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
  setup(props, { emit }) {
    const state = inject('state') as TableState
    const currentOrdering = ref('')

    const isVisible = computed(() => {
      if (state.currentBreakpoint.value) {
        return state.currentBreakpoint.value >= props.hiddenBelow
      } else {
        return true
      }
    })

    const iconName = computed(() => {
      if (currentOrdering.value.startsWith('-')) {
        return 'arrow-down'
      } else {
        return 'arrow-up'
      }
    })

    function toggleOrdering() {
      switch (currentOrdering.value) {
        case '':
          currentOrdering.value = props.orderKey
          break
        case props.orderKey:
          currentOrdering.value = '-' + props.orderKey
          break
        case '-' + props.orderKey:
          currentOrdering.value = ''
          break
      }
      emit('ordering', currentOrdering.value)
      state.ordering.current.value = currentOrdering.value
    }

    return {
      iconName,
      currentOrdering,
      toggleOrdering,
      isVisible,
    }
  },
})
</script>
