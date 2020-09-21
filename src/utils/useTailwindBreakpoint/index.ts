import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { breakpoint, breakpointMinWidths, breakpointObject } from '../../types'

export function useBreakpoint(
  minWidths: breakpointMinWidths = {
    1: 0,
    2: 640,
    3: 768,
    4: 1024,
    5: 1280,
  }
) {
  const currentBreakpoint = ref(breakpoint.MOBILE)

  // Extract interface as object and order by pixels DESC to minimize value
  const widths: Array<breakpointObject> = Object.entries(minWidths).map((key) => {
    return {
      breakpoint: parseInt(key[0]),
      pixels: key[1],
    }
  })
  widths.sort((a, b) => b.pixels - a.pixels)

  function resizeFn() {
    const width = window.innerWidth
    for (let item of widths) {
      if (width >= item.pixels) {
        currentBreakpoint.value = item.breakpoint
        break
      }
    }
  }

  onBeforeMount(() => {
    window.addEventListener('resize', resizeFn)
    resizeFn()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeFn)
  })

  return {
    currentBreakpoint,
  }
}
