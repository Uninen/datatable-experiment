<template>
  <tbody>
    <tr v-for="(obj, index) in data" :key="index">
      <slot v-bind:item="obj" v-bind:breakpoint="breakpoint">
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
import { debug } from './utils/dev'

export default defineComponent({
  components: {
    TdItem,
  },
  setup(_, { slots }) {
    let dataKeys: string[] = []
    let keysShifted = false
    const state = inject('state') as TableState

    function extractDataKeys() {
      if (!keysShifted && state.data.current && state.data.current.value.length > 0) {
        debug.run('extractDataKeys')
        dataKeys = Object.keys(state.data.current.value[0])
        dataKeys.reverse()
        state.data.current.value.unshift({})
        keysShifted = true
      }
    }

    if (!slots.default) {
      watchEffect(() => {
        extractDataKeys()
      })
    }

    return {
      data: state.data.current,
      breakpoint: state.currentBreakpoint,
      dataKeys,
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
