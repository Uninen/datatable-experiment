import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import { makeServer } from './utils/mirage-devserver'

makeServer()

createApp(App).mount('#app')
