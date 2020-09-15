<template>
  <div class="px-8">
    <table>
      <slot />
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { globalState } from '../store'

export default defineComponent({
  props: {
    data: Object,
  },
  setup() {
    return {
      count: toRef(globalState, 'count'),
    }
  },
})
</script>
