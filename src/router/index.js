import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/components/App'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/components/Dashboard')
      },
      {
        path: 'services',
        name: 'services',
        component: () => import('@/components/services/ServicesList')
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/components/HistoryList')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/components/SettingsView')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login')
  },
  {
    path: '/client',
    name: 'client',
    component: () => import('@/components/OwnlineClient')
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/components/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: '',
  linkExactActiveClass: '',
  routes
})

export default router
