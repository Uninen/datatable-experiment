<template>
  <th
    v-if="isVisible"
    class="items-center px-6 py-3 text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase bg-gray-200"
    @click="toggleOrdering"
  >
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
    const currentBreakpoint = inject<Ref<Breakpoint>>('currentBreakpoint')

    const isVisible = computed(() => {
      if (currentBreakpoint?.value) {
        return currentBreakpoint.value >= props.hiddenBelow
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
