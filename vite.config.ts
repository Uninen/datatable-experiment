import { resolve } from 'path'
import type { SharedConfig } from 'vite'
const config: SharedConfig = {
  alias: {
    '/@/': resolve(__dirname, 'src'),
  },
}

export default config
