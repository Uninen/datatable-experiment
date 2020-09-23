import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import TIcon from './components/datatable/TIcon.vue'

import { makeServer } from './utils/mirage-devserver'

makeServer()

createApp(App).component('t-icon', TIcon).mount('#app')
