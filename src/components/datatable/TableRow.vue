<template>
  <tbody>
    <tr v-for="(obj, index) in data" :key="index">
      <slot v-bind:item="obj" v-bind:formatDate="dateFormatter">
        <template v-if="dataKeys && index === 0">
          <th v-for="dk in dataKeys" class="datatable">
            {{ dk }}
          </th>
        </template>
        <template v-else-if="dataKeys">
          <td v-for="dk in dataKeys" class="datatable">
            {{ obj[dk] }}
          </td>
        </template>
      </slot>
    </tr>
  </tbody>
</template>
<script lang="ts">
import { defineComponent, inject, watchEffect } from 'vue'
import TdItem from './TdItem.vue'
import { TableState } from './types'

export default defineComponent({
  components: {
    TdItem,
  },
  setup(_, { slots }) {
    let dataKeys: string[] = []
    let keysShifted = false
    const state = inject('state') as TableState

    const data = state.data.current.value
    const dateFormatter = inject('dateFormatter')

    function extractDataKeys() {
      if (!keysShifted && data && data.length > 0) {
        dataKeys = Object.keys(data[0])
        dataKeys.reverse()
        data.unshift({})
        keysShifted = true
      }
    }

    if (!slots.default) {
      watchEffect(() => {
        extractDataKeys()
      })
    }

    return {
      data,
      dataKeys,
      dateFormatter,
    }
  },
})
</script>
<style scoped>
td.datatable,
th.datatable {
  padding: 0.3rem 0.5rem;
}

th.datatable {
  font-weight: bold;
  text-align: left;
  border-bottom: 2px solid #bbb;
}

td.datatable {
  border-bottom: 1px solid #ddd;
}
</style>
