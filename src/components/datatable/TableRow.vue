<template>
  <tbody>
    <tr v-for="(obj, index) in data" :key="index">
      <slot v-bind:item="obj" />
    </tr>
  </tbody>
</template>
<script lang="ts">
import { defineComponent, watchEffect, inject } from 'vue'

export default defineComponent({
  setup() {
    const state = inject('state')
    const data = inject('objectList')

    watchEffect(() => {
      console.log('Got data into rows: ', state.objectList)
    })

    return {
      data,
    }
  },
})
</script>
