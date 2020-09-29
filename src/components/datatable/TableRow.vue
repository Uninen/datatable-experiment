<template>
  <tbody>
    <tr v-for="(obj, index) in data" :key="index">
      <slot v-bind:item="obj" v-bind:formatDate="dateFormatter">
        <td v-for="dk in dataKeys">
          {{ obj[dk] }}
        </td>
      </slot>
    </tr>
  </tbody>
</template>
<script lang="ts">
import { defineComponent, inject, watchEffect, Ref } from 'vue'
import TdItem from './TdItem.vue'

export default defineComponent({
  components: {
    TdItem,
  },
  setup() {
    let dataKeys: string[] = []
    const data = inject('data') as Ref<object[]>
    const dateFormatter = inject('dateFormatter')

    function extractDataKeys() {
      console.log('extract dataKeys')
      if (data.value && data.value.length > 0) {
        dataKeys = Object.keys(data.value[0])
        console.log('dataKeys found!', dataKeys)
      } else {
        console.log('no dataKeys found.')
        console.log('data: ', data.value)
      }
    }

    watchEffect(() => {
      extractDataKeys()
    })

    return {
      data,
      dataKeys,
      dateFormatter,
    }
  },
})
</script>
