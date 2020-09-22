<template>
  <tbody>
    <tr v-for="(obj, index) in data" :key="index">
      <slot v-bind:item="obj" />
    </tr>
  </tbody>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  setup() {
    let data: Array<any> | undefined = inject('data')
    if (data === undefined) {
      data = []
    }

    return {
      data,
    }
  },
})
</script>
