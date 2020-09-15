<template>
  <table>
    <slot />
  </table>
</template>

<script lang="ts">
import { defineComponent, toRefs, provide } from 'vue'

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const { data } = toRefs(props)
    provide('data', data)
  },
})
</script>
