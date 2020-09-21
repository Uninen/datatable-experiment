export const enum breakpoint {
  MOBILE = 1,
  SM,
  MD,
  LG,
  XL,
}

export interface breakpointMinWidths {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export interface breakpointObject {
  breakpoint: number
  pixels: number
}
