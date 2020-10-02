import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import TIcon from './components/datatable/TIcon.vue'

import { makeDevServer } from './mirage/devServer'
import { makeTestServer } from './mirage/testServer'

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'testci') {
  if (process.env.NODE_ENV === 'testci') {
    makeTestServer()
  }
  makeDevServer()
} else {
  // We want to run MirageJS on Vercel as well
  makeDevServer('dev')
}

createApp(App).component('t-icon', TIcon).use(router).mount('#app')
