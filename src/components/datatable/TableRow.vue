<template>
  <tbody>
    <tr v-for="(obj, index) in data" :key="index">
      <slot v-bind:item="obj">
        <template v-if="dataKeys">
          <td v-for="dk in dataKeys">
            {{ obj[dk] }}
          </td>
        </template>
        <template v-else>
          {{ obj }}
        </template>
      </slot>
    </tr>
  </tbody>
</template>
<script lang="ts">
import { defineComponent, inject, watch } from 'vue'
import TdItem from './TdItem.vue'

export default defineComponent({
  components: {
    TdItem,
  },
  setup() {
    let dataKeys = []
    let data = inject('data')

    console.log('row data: ', data)

    if (data[0]) {
      dataKeys = Object.keys(data[0])
      console.log('Keys: ', dataKeys)
    }

    watch(
      () => data,
      () => {
        console.log('row data changed')

        if (data[0]) {
          dataKeys = Object.keys(data[0])
          console.log('Keys: ', dataKeys)
        } else {
          console.log('no keys')
        }
      }
    )

    return {
      data,
      dataKeys,
    }
  },
})
</script>
