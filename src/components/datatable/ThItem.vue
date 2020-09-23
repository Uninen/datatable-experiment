<template>
  <th
    v-if="isVisible"
    class="px-6 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200"
    @click="toggleOrdering"
  >
    <slot />

    <span v-if="orderKey" class="pl-4">
      {{ orderingVisual }}
    </span>
  </th>
</template>
<script lang="ts">
import { defineComponent, inject, ref, Ref, computed } from 'vue'

import { Breakpoint } from '../../types'

export default defineComponent({
  emits: ['ordering'],
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
    const currentOrdering = ref('')
    const orderingVisual = ref('NONE')
    const currentBreakpoint = inject<Ref<Breakpoint>>('currentBreakpoint')

    const isVisible = computed(() => {
      if (currentBreakpoint?.value) {
        return currentBreakpoint.value >= props.hiddenBelow
      } else {
        return true
      }
    })

    function toggleOrdering() {
      switch (currentOrdering.value) {
        case '':
          currentOrdering.value = props.orderKey
          orderingVisual.value = currentOrdering.value
          break
        case props.orderKey:
          currentOrdering.value = '-' + props.orderKey
          orderingVisual.value = currentOrdering.value
          break
        case '-' + props.orderKey:
          currentOrdering.value = ''
          orderingVisual.value = 'NONE'
          break
      }
      console.log('emitting toggleOrdering: ', currentOrdering.value)
      console.log('orderingVisual: ', orderingVisual.value)
      emit('ordering', currentOrdering.value)
    }

    return {
      orderingVisual,
      toggleOrdering,
      isVisible,
    }
  },
})
</script>
