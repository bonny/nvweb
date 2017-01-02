
import Vue from 'vue'
import appView from './components/App.vue'
import store from './store.js'
let router = require('./router.js')

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
  },
  mounted () {
    // when app is mounted we load the options from the db
    this.$store.dispatch({
      type: 'loadOptionsFromDB'
    })
  }
})
