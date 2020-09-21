<template>
  <table>
    <slot />
  </table>
</template>

<script lang="ts">
import { defineComponent, toRefs, provide, watchEffect } from 'vue'
import { useBreakpoint } from '../utils/useTailwindBreakpoint'

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
    console.log('using currentBreakpoint', currentBreakpoint.value)

    provide('data', data)
    provide('currentBreakpoint', currentBreakpoint)

    watchEffect(() => {
      console.log('currentBreakpoint inside DataTable: ', currentBreakpoint.value)
    })
  },
})
</script>
