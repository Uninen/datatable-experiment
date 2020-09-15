<template>
  <td class="p-2">
    <slot>
      {{ item }}
    </slot>
  </td>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: false,
    },
  },
})
</script>
