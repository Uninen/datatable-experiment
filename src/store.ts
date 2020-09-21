import { reactive } from 'vue'
import { breakpoint } from './types'

export const globalState = reactive({
  itemsPerPage: 3,
  currentBreakpoint: breakpoint.MOBILE,
})
