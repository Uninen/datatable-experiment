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

    const filter = state.filters.value.find((item) => {
      return item.property === props.property
    })
    const filterIndex = findIndex(state.filters.value, { property: props.property })

    if (filter) {
      if (filter.type === 'boolean') {
        statusChoices = boolStatusChoices
      }
    } else {
      warn(`Filter with key "${props.property}" not found in configuration.`)
    }

    const changeFn = (event: any) => {
      if (event.target.value === 'true') {
        state.filters.value[filterIndex].isActive = true
      } else if (event.target.value === 'false') {
        state.filters.value[filterIndex].isActive = false
      } else {
        state.filters.value[filterIndex].isActive = null
      }
      console.log('filter index:', filterIndex)
      debug.log(`Filter "${props.property}" change to ${state.filters.value[filterIndex].isActive}`)
    }

    return {
      filter,
      statusChoices,
      currentVal: state.filters.value[filterIndex].isActive,
      changeFn,
    }
  },
})
</script>
