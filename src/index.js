
import Vue from 'vue'
import VueRouter from 'vue-router'
// import VueMdl from 'vue-mdl/dist/vue-mdl.js'
import Vuex from 'vuex'
import config from './config.js'
import appView from './app.vue'
import Settings from './settings.vue'
import Dexie from 'dexie'
let Dropbox = require('dropbox')

// https://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication
window.bus = new Vue()

Vue.use(VueRouter)
Vue.use(Vuex)
// Vue.use(VueMdl)

Vue.directive('mdl', {
  bind: function (el) {
    console.log('mdl directive el', el)
    window.componentHandler.upgradeElement(el)
  }
})

function testDropbox () {
  console.log('testDropbox', config)
  let pathToList = '/nvalt'
  var dbx = new Dropbox({ accessToken: config.dropbox.token })
  dbx.filesListFolder({path: pathToList})
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
}

// testDropbox()

// Define routes
const routes = [
  {
    path: '/settings',
    component: Settings,
    name: 'settings'
  }
]

// Create the router instance and pass the `routes` option
const router = new VueRouter({
  xmode: 'history',
  routes
})

// Create and mount the root instance.
var app = new Vue({
  router,
  el: '#app',
  render: function (createElement) {
    return createElement(appView)
  },
  mounted () {
    console.log('app mounted')
    console.log('app mounted bus', window.bus)
    window.bus.$emit('app-mounted')
  }
})

// Now the app has started!
console.log('app', app)
console.log('bus', window.bus)
console.log('Dexie', Dexie)
