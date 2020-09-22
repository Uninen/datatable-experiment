export const enum Breakpoint {
  MOBILE = 1,
  SM,
  MD,
  LG,
  XL,
}

export interface BreakpointMinWidths {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export interface BreakpointObject {
  breakpoint: number
  pixels: number
}
