
// require('intersection-observer')

import Vue from 'vue'
import VueAnalytics, { loadScript } from 'vue-analytics'
import appView from './components/App.vue'
import store from './store.js'
import router from './router.js'
import vueMoment from 'vue-moment'
import VueObserveVisibility from 'vue-observe-visibility'
import VueVirtualScroller from 'vue-virtual-scroller'

Vue.use(VueObserveVisibility)
Vue.use(VueVirtualScroller)
Vue.use(vueMoment)
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
