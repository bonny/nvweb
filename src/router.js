import Settings from './components/Settings.vue'
import Edit from './components/Edit.vue'
import Debug from './components/Debug.vue'
import Home from './components/Home.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/settings',
    component: Settings,
    name: 'settings'
  },
  {
    path: '/edit/:noteID/:focusText',
    component: Edit,
    name: 'edit'
  },
  {
    path: '/debug',
    component: Debug,
    name: 'debug'
  },
  {
    path: '/',
    component: Home,
    name: 'home'
  },
  {
    path: '*',
    component: Home,
    name: 'default'
  }
]

// Create the router instance and pass the `routes` option
const router = new VueRouter({
  routes
})

module.exports = router
