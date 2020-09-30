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
import { defineComponent, inject, watchEffect, Ref } from 'vue'
import TdItem from './TdItem.vue'

export default defineComponent({
  components: {
    TdItem,
  },
  setup(_, { slots }) {
    let dataKeys: string[] = []
    let keysShifted = false

    const data = inject('data') as Ref<any[]>
    const dateFormatter = inject('dateFormatter')

    function extractDataKeys() {
      console.log('extract dataKeys')
      if (!keysShifted && data.value && data.value.length > 0) {
        dataKeys = Object.keys(data.value[0])
        dataKeys.reverse()
        data.value.unshift({})
        console.log('dataKeys found!', dataKeys)
        keysShifted = true
      } else {
        console.log('no dataKeys found.')
        console.log('data: ', data.value)
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
