<template>
  <slot
    v-bind="{
      filter,
    }"
  ></slot>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue'
import { TableState } from './types'
import { warn } from './utils/dev'

export default defineComponent({
  props: {
    property: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const state = inject('state') as TableState
    let statusChoices: string[] = []
    const boolStatusChoices = ['All', 'Yes', 'No']

    const filter = state.filters.find((item) => {
      return item.property == props.property
    })

    if (filter) {
      if (filter.type === 'boolean') {
        statusChoices = boolStatusChoices
      }
    } else {
      warn(`Filter with key "${props.property}" not found in configuration.`)
    }

    return {
      filter,
      statusChoices,
    }
  },
})
</script>
