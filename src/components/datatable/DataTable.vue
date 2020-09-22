<template>
  <table>
    <slot />
  </table>
</template>

<script lang="ts">
import { defineComponent, toRefs, provide } from 'vue'
import { useBreakpoint } from '../../utils/useTailwindBreakpoint'

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const { data } = toRefs(props)
    const { currentBreakpoint } = useBreakpoint()

    provide('data', data)
    provide('currentBreakpoint', currentBreakpoint)
  },
})
</script>
