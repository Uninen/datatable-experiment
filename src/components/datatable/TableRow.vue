<template>
  <tbody>
    <tr v-for="(obj, index) in data" :key="index">
      <slot v-bind="$attrs" v-bind:item="obj">
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
    let dataKeys: string[] = []
    let data = inject('data')

    if (data[0]) {
      dataKeys = Object.keys(data[0])
    }

    watch(
      () => data,
      () => {
        if (data[0]) {
          dataKeys = Object.keys(data[0])
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
