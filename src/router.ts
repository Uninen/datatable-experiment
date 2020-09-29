import { createRouter, createWebHistory } from 'vue-router'

import Frame from './views/Frame.vue'
import Local from './views/Local.vue'
import Unstyled from './views/Unstyled.vue'
import Remote from './views/Remote.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  strict: true,
  linkExactActiveClass: 'font-bold',
  routes: [
    {
      path: '/',
      name: 'Frame',
      component: Frame,
      children: [
        {
          path: '',
          name: 'Remote',
          component: Remote,
        },
        {
          path: '/local/',
          name: 'Local',
          component: Local,
        },
        {
          path: '/unstyled/',
          name: 'Unstyled',
          component: Unstyled,
        },
      ],
    },
  ],
})

export default router
