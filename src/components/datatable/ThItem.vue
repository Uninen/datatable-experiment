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
import { defineComponent, inject, ref, Ref, computed } from 'vue'
import { Emitter } from 'mitt'

import { Breakpoint } from './types'

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
    const currentOrdering = ref('')
    const currentBreakpoint = inject<Ref<Breakpoint>>('currentBreakpoint')
    const tableId = inject('tableId') as string
    const bus = inject('bus') as Emitter

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
      bus.emit(`ordering-${tableId}`, currentOrdering.value)
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
