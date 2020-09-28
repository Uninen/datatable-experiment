import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import TIcon from './components/datatable/TIcon.vue'

import { makeDevServer } from './utils/mirage-dev-server'
import { makeTestServer } from './utils/mirage-test-server'

if (process.env.NODE_ENV === 'test') {
  // @ts-expect-error
  if (window.Cypress) {
    makeTestServer()
  }
}

if (process.env.NODE_ENV === 'development') {
  console.log('Making dev server')
  makeDevServer()
}

createApp(App).component('t-icon', TIcon).mount('#app')
