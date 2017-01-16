
import Vue from 'vue'
import VueAnalytics, { loadScript } from 'vue-analytics'
import appView from './components/App.vue'
import store from './store.js'
let router = require('./router.js')
let vueMoment = require('vue-moment')

// https://github.com/brockpetrie/vue-moment
Vue.use(vueMoment)

// https://github.com/MatteoGabriele/vue-analytics
Vue.use(VueAnalytics, { router })

loadScript('UA-181460-38')

// Make elements work with Material Design Lite
Vue.directive('mdl', {
  bind: function (el) {
    window.componentHandler.upgradeElement(el)
  }
})

// Create and mount the root instance.
window.app = new Vue({
  router,
  store,
  el: '#app',
  render: function (createElement) {
    return createElement(appView)
  },
  methods: {
  }
})
