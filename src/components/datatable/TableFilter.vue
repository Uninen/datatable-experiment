<template>
  <slot
    v-bind="{
      filter,
      statusChoices,
      currentVal,
      changeFn,
    }"
  ></slot>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue'
import { findIndex } from 'lodash-es'

import { TableState } from './types'
import { warn, debug } from './utils/dev'

export default defineComponent({
  props: {
    property: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const state = inject('state') as TableState

    let statusChoices: object[] = []

    const boolStatusChoices = [
      { label: 'All', value: null },
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ]

    const filter = state.filters.find((item) => {
      return item.property == props.property
    })
    const filterIndex = findIndex(state.filters, { property: props.property })

    if (filter) {
      if (filter.type === 'boolean') {
        statusChoices = boolStatusChoices
      }
    } else {
      warn(`Filter with key "${props.property}" not found in configuration.`)
    }

    const changeFn = (event: any) => {
      if (event.target.value === 'true') {
        state.filters[filterIndex].isActive.value = true
      } else if (event.target.value === 'false') {
        state.filters[filterIndex].isActive.value = false
      } else {
        state.filters[filterIndex].isActive.value = null
      }
      debug.log(`Filter "${props.property}" change to ${state.filters[filterIndex].isActive.value}`)
    }

    return {
      filter,
      statusChoices,
      currentVal: state.filters[filterIndex].isActive,
      changeFn,
    }
  },
})
</script>
